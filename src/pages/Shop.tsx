const products = Array.from({ length: 6 }, (_, index) => index + 1);

const Shop = () => {
  return (
    <section className="section">
      <div className="container stack-lg">
        <h1 className="section-title">Shop</h1>

        <div className="post-card post-card--accent stack-md">
          <h2 className="section-title section-title--sub">Featured Bundle</h2>
          <p className="muted muted--inverted">
            Training plan + habit tracker + devotion prompts.
          </p>
          <button className="button button--inverted" type="button">
            See Bundle
          </button>
        </div>

        <div className="card-grid card-grid--three">
          {products.map((index) => (
            <div className="product-card" key={index}>
              <div className="video-thumb video-thumb--small" />
              <h3>Product {index}</h3>
              <p className="muted">Short description of value and who it is for.</p>
              <button className="button" type="button">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Shop;
