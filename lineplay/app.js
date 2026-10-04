const $=id=>document.getElementById(id),canvas=$('canvas'),ctx=canvas.getContext('2d');
const palette=['#e53935','#2563eb','#eab308','#171717','#ec4899','#16a34a'];
const instruments=[
{name:'Red',label:'Pitched tom',wave:'tom'},
{name:'Blue',label:'Sine',wave:'sine'},
{name:'Yellow',label:'Square',wave:'square'},
{name:'Black',label:'Minor chord',wave:'sine'},
{name:'Pink',label:'Triangle',wave:'triangle'},
{name:'Green',label:'808-style kick',wave:'kick'}
];
function instrument(c){return instruments[palette.indexOf(c)]||instruments[1]}
function brushLabel(){const i=instrument(color);$('brushSound').textContent=i.name+' / '+i.label}

let color=palette[0],mode='music',drawing=false,current=null,audio=null,playStart=0,duration=0,playing=false,nodes=[],voice=null,voiceGain=null,liveReady=false,liveToken=0,playTimer=null,sequence=[],sequenceIndex=0,activePoint=null,master=null,scoreDirty=true,nextStep=0,nextTime=0,playheadMarks=[],playbackMode="scan";
const strokes=[];
palette.forEach((c,i)=>{const b=document.createElement('button');b.className='swatch'+(!i?' selected':'');b.style.background=c;b.title=instruments[i].name+' / '+instruments[i].label;b.setAttribute('aria-label',b.title);b.setAttribute('aria-pressed',String(!i));b.onclick=()=>{color=c;document.querySelectorAll('.swatch').forEach(x=>{const selected=x===b;x.classList.toggle('selected',selected);x.setAttribute('aria-pressed',String(selected))});brushLabel()};document.querySelector('.colors').append(b)});brushLabel();
function resize(){const r=canvas.getBoundingClientRect(),d=devicePixelRatio||1;canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);ctx.setTransform(d,0,0,d,0,0)}new ResizeObserver(resize).observe(canvas);
function point(e){const r=canvas.getBoundingClientRect();return {x:Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))}}
canvas.onpointerdown=async e=>{if(e.button!==0)return;canvas.setPointerCapture(e.pointerId);drawing=true;current={color,width:+$('brush').value,phase:Math.random()*6.28,points:[point(e)]};strokes.push(current);scoreDirty=true;update();const token=++liveToken;if(mode==='music'){try{await ensureAudio();if(drawing&&token===liveToken){liveReady=true;lastKick=-Infinity;lastTom=-Infinity;lastTomPitch=null;sound(current.points.at(-1).y,current.color);$('status').textContent='Drawing notes.'}}catch{$('status').textContent='Audio could not start. Try drawing again.'}}};
canvas.onpointermove=e=>{if(drawing&&current){const coalesced=e.getCoalescedEvents?.();const samples=coalesced?.length?coalesced:[e];for(const sample of samples){const p=point(sample),q=current.points.at(-1);if(Math.hypot(p.x-q.x,p.y-q.y)>.002){current.points.push(p);scoreDirty=true;if(mode==='music'&&liveReady)sound(p.y,current.color)}}}};
function end(){drawing=false;current=null;liveReady=false;liveToken++;silence()}canvas.onpointerup=end;canvas.onpointercancel=end;canvas.onlostpointercapture=end;
function update(){$('status').textContent=playing?'Playing notes — keep drawing to add more.':strokes.length?strokes.length+' line'+(strokes.length===1?'':'s')+' of possibility.':'Draw to hear notes, or press play to start.'}
function silence(){if(voiceGain&&audio)voiceGain.forEach(g=>g.gain.setTargetAtTime(0,audio.currentTime,.025))}
async function ensureAudio(){
// Use the music playback session rather than iOS ambient audio.
try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch{}
const AudioContextClass=window.AudioContext||window.webkitAudioContext;
if(!AudioContextClass)throw new Error('Web Audio is unavailable');
if(!audio||audio.state==='closed'){audio=new AudioContextClass();master=null;voice=null;voiceGain=null}
const resumed=audio.resume();
if(!master){master=audio.createDynamicsCompressor();master.threshold.value=-18;master.ratio.value=8;master.connect(audio.destination)}
if(!voice){voice=[];voiceGain=[];for(let i=0;i<3;i++){const osc=audio.createOscillator(),gain=audio.createGain();gain.gain.value=0;osc.connect(gain).connect(master);osc.start();voice.push(osc);voiceGain.push(gain)}}
// Start a silent buffer within the tap itself to unlock mobile audio output.
const unlock=audio.createBufferSource();unlock.buffer=audio.createBuffer(1,1,audio.sampleRate);unlock.connect(audio.destination);unlock.onended=()=>unlock.disconnect();unlock.start();
let resumeTimeout;try{await Promise.race([resumed,new Promise((_,reject)=>{resumeTimeout=setTimeout(()=>reject(new Error('Sound is blocked. Tap Play drawing to try again.')),2500)})])}finally{clearTimeout(resumeTimeout)}
if(audio.state!=='running')throw new Error('Tap Play drawing to enable sound');
}
canvas.addEventListener('touchend',()=>{if(audio&&audio.state!=='running')ensureAudio().catch(()=>{$('status').textContent='Tap Play drawing to enable sound.'})},{passive:true});
const minor=[0,2,3,5,7,8,10];
function degree(y){return Math.max(0,Math.min(20,Math.round((1-y)*20)))}
function midi(y){const d=degree(y);return 45+12*Math.floor(d/7)+minor[d%7]}
function pitchMidi(y){return playbackMode==='continuous'?45+34*(1-Math.max(0,Math.min(1,y))):midi(y)}
let lastKick=-Infinity,lastTom=-Infinity,lastTomPitch=null;
function kick(t=audio.currentTime,level=.32){const osc=audio.createOscillator(),gain=audio.createGain();osc.type='sine';osc.frequency.setValueAtTime(150,t);osc.frequency.exponentialRampToValueAtTime(48,t+.065);osc.frequency.exponentialRampToValueAtTime(38,t+.65);gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(level,t+.004);gain.gain.exponentialRampToValueAtTime(.0001,t+.75);osc.connect(gain).connect(master);nodes.push(osc);osc.onended=()=>{osc.disconnect();gain.disconnect();nodes=nodes.filter(n=>n!==osc)};osc.start(t);osc.stop(t+.8)}
function tom(y,t=audio.currentTime,level=1){
const root=440*Math.pow(2,(pitchMidi(y)-81)/12);
for(const [ratio,volume,decay] of [[1,.24,.38],[1.58,.055,.12]]){
const osc=audio.createOscillator(),gain=audio.createGain();osc.type='sine';
osc.frequency.setValueAtTime(root*ratio*1.65,t);osc.frequency.exponentialRampToValueAtTime(root*ratio,t+.045);
gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(volume*level,t+.003);gain.gain.exponentialRampToValueAtTime(.0001,t+decay);
osc.connect(gain).connect(master);nodes.push(osc);osc.onended=()=>{osc.disconnect();gain.disconnect();nodes=nodes.filter(n=>n!==osc)};
osc.start(t);osc.stop(t+decay+.02)
}
}
function sound(y,ink){if(!voice)return;const patch=instrument(ink);if(patch.wave==='tom'){silence();const pitch=pitchMidi(y),elapsed=audio.currentTime-lastTom;if(!liveReady||elapsed>=.18||(pitch!==lastTomPitch&&elapsed>=.055)){tom(y);lastTom=audio.currentTime;lastTomPitch=pitch}return}if(patch.wave==='kick'){silence();if(!liveReady||audio.currentTime-lastKick>=.18){kick();lastKick=audio.currentTime}return}const chord=patch.label==='Minor chord',offsets=chord?[0,3,7]:[0],volume=chord?.035:patch.wave==='square'?.035:patch.wave==='sawtooth'?.045:.09;voice.forEach((osc,i)=>{osc.type=patch.wave;const active=i<offsets.length;if(active)osc.frequency.setTargetAtTime(440*Math.pow(2,(pitchMidi(y)+offsets[i]-69)/12),audio.currentTime,.025);voiceGain[i].gain.setTargetAtTime(active?volume:0,audio.currentTime,.015)})}
const STEPS=64;
function score(){
const columns=Array.from({length:STEPS},()=>[]);
for(const stroke of strokes){
const seen=new Set(),isKick=instrument(stroke.color).wave==='kick';
const add=(step,y)=>{step=Math.max(0,Math.min(STEPS-1,step));const key=step+':'+(isKick?'kick':midi(y));if(seen.has(key))return;seen.add(key);columns[step].push({y,color:stroke.color})};
for(let i=0;i<stroke.points.length;i++){
const p=stroke.points[i];add(Math.floor(p.x*STEPS),p.y);
if(!i)continue;const q=stroke.points[i-1],dx=p.x-q.x;if(Math.abs(dx)<1e-8)continue;
const left=Math.min(p.x,q.x),right=Math.max(p.x,q.x);
for(let step=Math.max(0,Math.ceil(left*STEPS-.5));step<STEPS&&(step+.5)/STEPS<=right;step++){
const x=(step+.5)/STEPS,f=(x-q.x)/dx;add(step,q.y+(p.y-q.y)*f)
}
}
}
return columns
}
function lineScore(){
const events=[];
for(const stroke of strokes){
let previous=null,previousPoint=null,distance=0;const isKick=instrument(stroke.color).wave==='kick';
for(const p of stroke.points){
if(isKick){if(previousPoint)distance+=Math.hypot(p.x-previousPoint.x,p.y-previousPoint.y);if(!previousPoint||distance>=.06){events.push([{...p,color:stroke.color}]);distance=0}}
else{const next=degree(p.y);if(previous===null)events.push([{...p,color:stroke.color}]);else if(next!==previous){const direction=Math.sign(next-previous);for(let d=previous+direction;d!==next+direction;d+=direction){const f=(d-previous)/(next-previous);events.push([{x:previousPoint.x+(p.x-previousPoint.x)*f,y:1-d/20,color:stroke.color}])}}previous=next}
previousPoint=p
}
events.push([])
}
return events
}
function playbackScore(){return playbackMode==='scan'?score():lineScore()}
function playbackLength(){return 60/+$('tempo').value/(playbackMode==='scan'?4:2)}
function playbackHint(){$('hint').textContent=playbackMode==='continuous'?'Continuous left-to-right playback. Height bends pitch freely, without a scale.':playbackMode==='scan'?'Playback scans left to right. Marks in the same column play together.':'Playback follows each line in drawing order. Curves rise and fall through the notes.'}
function startPlayback(){continuousPosition=0;continuousTime=audio.currentTime;sequence=playbackScore();scoreDirty=playbackMode==='continuous';nextStep=0;nextTime=audio.currentTime+.08;playheadMarks=[];playing=true;$('play').textContent='■ Stop playing';tick();update()}
function selectPlayback(value){if(value===playbackMode)return;const resume=playing;stop();playbackMode=value;scoreDirty=true;$('scanMode').setAttribute('aria-pressed',String(value==='scan'));$('followMode').setAttribute('aria-pressed',String(value==='follow'));$('continuousMode').setAttribute('aria-pressed',String(value==='continuous'));playbackHint();if(resume)startPlayback();else update()}
$('scanMode').onclick=()=>selectPlayback('scan');
$('followMode').onclick=()=>selectPlayback('follow');
$('continuousMode').onclick=()=>selectPlayback('continuous');
function playNote(event,t,length,level){
const patch=instrument(event.color);if(patch.wave==='tom'){tom(event.y,t,level);return}if(patch.wave==='kick'){kick(t,.24*level);return}
const offsets=patch.label==='Minor chord'?[0,3,7]:[0];
const volume=(patch.wave==='square'?.035:patch.wave==='sawtooth'?.045:.08)*level/Math.sqrt(offsets.length);
for(const offset of offsets){
const osc=audio.createOscillator(),gain=audio.createGain();osc.type=patch.wave;
osc.frequency.setValueAtTime(440*Math.pow(2,(midi(event.y)+offset-69)/12),t);
gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(volume,t+.008);
gain.gain.setValueAtTime(volume,t+length*.8);gain.gain.exponentialRampToValueAtTime(.0001,t+length+.03);
osc.connect(gain).connect(master);nodes.push(osc);osc.onended=()=>{osc.disconnect();gain.disconnect();nodes=nodes.filter(n=>n!==osc)};
osc.start(t);osc.stop(t+length+.04)
}
}
let continuousPosition=0,continuousTime=0,continuousRuns=[],continuousVoices=new Map(),strokeIds=new WeakMap(),nextStrokeId=0;
function freeFrequency(y){return 440*Math.pow(2,(45+34*(1-Math.max(0,Math.min(1,y)))-69)/12)}
function splitRuns(stroke){
const runs=[];let run=[],direction=0;
for(const p of stroke.points){if(run.length){const d=Math.sign(p.x-run.at(-1).x);if(d&&direction&&d!==direction){runs.push(run);run=[run.at(-1)];direction=d}else if(d)direction=d}run.push(p)}
if(run.length)runs.push(run);
return runs.map(points=>points[0].x>points.at(-1).x?[...points].reverse():points)
}
function runHeight(points,x){
const first=points[0],last=points.at(-1);
if(x<first.x-.003||x>last.x+.003)return null;
for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i];if(x>=a.x&&x<=b.x){const f=b.x===a.x?0:(x-a.x)/(b.x-a.x);return a.y+(b.y-a.y)*f}}
return x<=first.x?first.y:last.y
}
function stopContinuous(){for(const v of continuousVoices.values())for(const part of v.parts){try{part.osc.stop()}catch{}}continuousVoices.clear()}
function makeContinuousVoice(run,y,t,level){
const patch=instrument(run.color),parts=[],v={parts,started:t,patch};
if(patch.wave==='kick'){kick(t,.24*level);return v}
const ratios=patch.wave==='tom'?[1,1.58]:patch.label==='Minor chord'?[1,Math.pow(2,3/12),Math.pow(2,7/12)]:[1];
ratios.forEach((ratio,i)=>{
const osc=audio.createOscillator(),gain=audio.createGain();osc.type=patch.wave==='tom'?'sine':patch.wave;
const base=(patch.wave==='tom'?i===0?.2:.05:patch.wave==='square'?.035:.07)*level/Math.sqrt(ratios.length);
osc.frequency.setValueAtTime(freeFrequency(y)*ratio/(patch.wave==='tom'?2:1),t);gain.gain.value=0;
osc.connect(gain).connect(master);nodes.push(osc);osc.onended=()=>{osc.disconnect();gain.disconnect();nodes=nodes.filter(n=>n!==osc)};
osc.start(t);parts.push({osc,gain,ratio,base})
});
return v
}
function tickContinuous(){
const t=audio.currentTime,elapsed=Math.max(0,t-continuousTime),sweep=60/+$('tempo').value*16;
const next=continuousPosition+elapsed/sweep;if(next>=1)stopContinuous();continuousPosition=next%1;continuousTime=t;
if(scoreDirty){continuousRuns=[];for(const stroke of strokes){if(!strokeIds.has(stroke))strokeIds.set(stroke,++nextStrokeId);splitRuns(stroke).forEach((points,i)=>continuousRuns.push({key:strokeIds.get(stroke)+':'+i,color:stroke.color,points}))}scoreDirty=false}
const active=continuousRuns.map(run=>({run,y:runHeight(run.points,continuousPosition)})).filter(hit=>hit.y!==null),keys=new Set(),level=1/Math.sqrt(Math.max(1,active.length));
for(const {run,y} of active){
keys.add(run.key);let v=continuousVoices.get(run.key);if(!v){v=makeContinuousVoice(run,y,t,level);continuousVoices.set(run.key,v)}
for(const part of v.parts){
part.osc.frequency.setTargetAtTime(freeFrequency(y)*part.ratio/(v.patch.wave==='tom'?2:1),t,.012);
const decay=v.patch.wave==='tom'?Math.exp(-(t-v.started)/(part.ratio===1?.2:.07)):1;
part.gain.gain.setTargetAtTime(part.base*decay,t,.012)
}
}
for(const [key,v] of continuousVoices){if(keys.has(key))continue;for(const part of v.parts){part.gain.gain.setTargetAtTime(0,t,.012);try{part.osc.stop(t+.06)}catch{}}continuousVoices.delete(key)}
}
function tick(){
if(!playing)return;
if(playbackMode==='continuous'){tickContinuous();playTimer=setTimeout(tick,16);return}
if(nextTime<audio.currentTime-.15){nextTime=audio.currentTime+.02}
while(nextTime<audio.currentTime+.08){
if(scoreDirty||nextStep>=sequence.length){sequence=playbackScore();scoreDirty=false;if(nextStep>=sequence.length)nextStep=0}
const length=playbackLength(),events=sequence[nextStep]||[],level=1/Math.sqrt(Math.max(1,events.length));
events.forEach(event=>playNote(event,nextTime,length,level));playheadMarks.push({step:nextStep,time:nextTime,length,point:events[0]||null});
nextTime+=length;nextStep=(nextStep+1)%Math.max(1,sequence.length)
}
playTimer=setTimeout(tick,25)
}
function stopSounds(){stopContinuous();nodes.forEach(n=>{try{n.stop()}catch{}});nodes=[]}
function stop(){stopSounds();playing=false;clearTimeout(playTimer);playTimer=null;playheadMarks=[];if(!liveReady)silence();$('play').textContent='▶ Play drawing'}
$('undo').onclick=()=>{end();stopSounds();strokes.pop();scoreDirty=true;update()};
$('clear').onclick=()=>{end();stopSounds();strokes.length=0;scoreDirty=true;update()};
$('tempo').oninput=()=>{$('tempoValue').textContent=$('tempo').value+' BPM'};
$('play').onclick=async()=>{if(playing){stop();update();return}try{await ensureAudio();if(mode!=='music')return;startPlayback()}catch(error){$('status').textContent=error.message||'Audio could not start. Tap Play drawing.'}};
playbackHint();update();
function render(now){const w=canvas.clientWidth,h=canvas.clientHeight;ctx.clearRect(0,0,w,h);for(const s of strokes){ctx.beginPath();s.points.forEach((p,i)=>{let x=p.x*w,y=p.y*h;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);if(s.points.length===1)ctx.lineTo(x+.1,y+.1)});ctx.strokeStyle=s.color;ctx.lineWidth=s.width;ctx.lineCap='round';ctx.lineJoin='round';if(s.color==='#171717'){ctx.strokeStyle='#999';ctx.lineWidth=s.width+2;ctx.stroke();ctx.strokeStyle=s.color;ctx.lineWidth=s.width}ctx.stroke()}if(playing&&playbackMode==='continuous'){const progress=(continuousPosition+Math.max(0,audio.currentTime-continuousTime)/(60/+$('tempo').value*16))%1;ctx.beginPath();ctx.moveTo(progress*w,0);ctx.lineTo(progress*w,h);ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.stroke()}else if(playing){while(playheadMarks.length>1&&playheadMarks[1].time<=audio.currentTime)playheadMarks.shift();const mark=playheadMarks[0];if(mark&&mark.time<=audio.currentTime){if(playbackMode==='scan'){const progress=Math.min(1,(mark.step+Math.max(0,Math.min(1,(audio.currentTime-mark.time)/mark.length)))/STEPS);ctx.beginPath();ctx.moveTo(progress*w,0);ctx.lineTo(progress*w,h);ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.stroke()}else if(mark.point){ctx.beginPath();ctx.arc(mark.point.x*w,mark.point.y*h,8,0,Math.PI*2);ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke()}}}requestAnimationFrame(render)}requestAnimationFrame(render);
$('save').onclick=()=>{const exportCanvas=document.createElement('canvas');exportCanvas.width=canvas.width;exportCanvas.height=canvas.height;const c=exportCanvas.getContext('2d');c.fillStyle='#080808';c.fillRect(0,0,exportCanvas.width,exportCanvas.height);c.drawImage(canvas,0,0);const a=document.createElement('a');a.download='lineplay-'+mode+'.png';a.href=exportCanvas.toDataURL('image/png');a.click();$('status').textContent='Your drawing has been saved.'};
