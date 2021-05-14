module.exports = {
  future: {
    webpack5: true,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/archive",
        destination: "/archive/1",
        permanent: true,
      },
      {
        source: "/category/:name",
        destination: "/category/:name/1",
        permanent: true
      }
    ];
  }
};
