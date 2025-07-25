import React, { useEffect } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { meta, clock_images_array } from "../../content_option";
import { Container, Row, Col } from "react-bootstrap";

export const Shop = () => {
  useEffect(() => {
    // Shopify Buy Button Script
    const scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
    
    function loadScript() {
      const script = document.createElement('script');
      script.async = true;
      script.src = scriptURL;
      document.head.appendChild(script);
      script.onload = ShopifyBuyInit;
    }

    function ShopifyBuyInit() {
      if (window.ShopifyBuy) {
        const client = window.ShopifyBuy.buildClient({
          domain: 'idsiks-0b.myshopify.com',
          storefrontAccessToken: 'c9fe8a231372826c44e60089da4770b5',
        });
        
        window.ShopifyBuy.UI.onReady(client).then(function (ui) {
          ui.createComponent('product', {
            id: '11955032686910',
            node: document.getElementById('product-component-1753459919659'),
            moneyFormat: '%24%7B%7Bamount%7D%7D',
            options: {
              "product": {
                "styles": {
                  "product": {
                    "@media (min-width: 601px)": {
                      "max-width": "calc(25% - 20px)",
                      "margin-left": "20px",
                      "margin-bottom": "50px"
                    },
                    "text-align": "left"
                  },
                  "button": {
                    "font-family": "Saira, sans-serif",
                    "font-weight": "bold",
                    "font-size": "14px",
                    "padding-top": "5px",
                    "padding-bottom": "5px",
                    "padding-left": "10px",
                    "padding-right": "10px",
                    ":hover": {
                      "background-color": "#333"
                    },
                    "background-color": "black",
                    "color": "white",
                    "border": "2px solid white",
                    ":focus": {
                      "background-color": "#333"
                    },
                    "border-radius": "15px"
                  },
                  "quantityInput": {
                    "font-size": "14px",
                    "padding-top": "15px",
                    "padding-bottom": "15px"
                  }
                },
                "contents": {
                  "img": false,
                  "title": false,
                  "price": false
                },
                "text": {
                  "button": "Add to cart"
                },
                "googleFonts": [
                  "Roboto"
                ]
              },
              "productSet": {
                "styles": {
                  "products": {
                    "@media (min-width: 601px)": {
                      "margin-left": "-20px"
                    }
                  }
                }
              },
              "modalProduct": {
                "contents": {
                  "img": false,
                  "imgWithCarousel": true,
                  "button": false,
                  "buttonWithQuantity": true
                },
                "styles": {
                  "product": {
                    "@media (min-width: 601px)": {
                      "max-width": "100%",
                      "margin-left": "0px",
                      "margin-bottom": "0px"
                    }
                  },
                  "button": {
                    "font-family": "Roboto, sans-serif",
                    "font-weight": "bold",
                    "font-size": "12px",
                    "padding-top": "5px",
                    "padding-bottom": "5px",
                    "padding-left": "10px",
                    "padding-right": "10px",
                    ":hover": {
                      "background-color": "#333"
                    },
                    "background-color": "black",
                    "color": "white",
                    "border": "2px solid white",
                    ":focus": {
                      "background-color": "#333"
                    },
                    "border-radius": "15px"
                  },
                  "quantityInput": {
                    "font-size": "14px",
                    "padding-top": "15px",
                    "padding-bottom": "15px"
                  }
                },
                "googleFonts": [
                  "Roboto"
                ],
                "text": {
                  "button": "Add to cart"
                }
              },
              "option": {},
              "cart": {
                "styles": {
                  "button": {
                    "font-family": "Roboto, sans-serif",
                    "font-weight": "bold",
                    "font-size": "12px",
                    "padding-top": "5px",
                    "padding-bottom": "0px",
                    "padding-left": "10px",
                    "padding-right": "10px",
                    ":hover": {
                      "background-color": "#333"
                    },
                    "background-color": "black",
                    "color": "white",
                    "border": "1px solid white",
                    ":focus": {
                      "background-color": "#333"
                    },
                    "border-radius": "15px"
                  }
                },
                "text": {
                  "total": "Subtotal",
                  "button": "Checkout"
                },
                "googleFonts": [
                  "Roboto"
                ]
              },
              "toggle": {
                "styles": {
                  "toggle": {
                
                    "font-family": "Roboto, sans-serif",
                    "font-weight": "bold",
                    "background-color": "black",
                    "color": "white",
                    "border": "1px solid white",
                    ":hover": {
                      "background-color": "#333"
                    },
                    ":focus": {
                      "background-color": "#333"
                    },
                    "border-radius": "15px"
                  },
                  "count": {
                    "font-size": "12px"
                  }
                },
                "googleFonts": [
                  "Roboto"
                ]
              }
            }
          });
        });
      }
    }

    if (window.ShopifyBuy) {
      if (window.ShopifyBuy.UI) {
        ShopifyBuyInit();
      } else {
        loadScript();
      }
    } else {
      loadScript();
    }
  }, []);

  return (
    <HelmetProvider>
      <Container>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title} | Shop</title>
          <meta name="description" content="Shop Sister Engineering products" />
        </Helmet>
        <Row className="mt-5">
          <Col lg="12">
            {/* Clock Images and Shopify Button Layout */}
            <div className="shop-layout">
              {/* Left Column: First Clock Image + Shopify Button */}
              <div className="left-column">
                <div className="shop_clock_item">
                  <img
                    src={clock_images_array[0]}
                    alt="Clock 1"
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
                            {/* Product Description - Under both images */}
            <div className="product-description">
              <p>
                <strong>Dimension:</strong> 6.4x34x14m<br/>
                <strong>Materials:</strong> Reclaimed box elder wood, electronics, steel hardware.<br/>
                <strong>Power source:</strong> USB cable included, 3v coin cell battery included
              </p>
            </div>
                {/* Price Text */}
                <div className="price-text">
                  $444.44
                </div>
                {/* Shopify Buy Button Section */}
                <div className="shopify-embed">
                  <div id='product-component-1753459919659'></div>
                </div>
              </div>
              
              {/* Right Column: Second Clock Image */}
              <div className="right-column">
                {clock_images_array.length > 1 && (
                  <div className="shop_clock_item">
                    <img
                      src={clock_images_array[1]}
                      alt="Clock 2"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                )}
              </div>
            </div>
            
          </Col>
        </Row>
      </Container>
    </HelmetProvider>
  );
};
