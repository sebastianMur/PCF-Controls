const path = require('path');
module.exports = {
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'ExecuteAFETemplateControl/components'),
      '@generated': path.resolve(__dirname, 'ExecuteAFETemplateControl/generated'),
      '@utils': path.resolve(__dirname, 'ExecuteAFETemplateControl/utils'),
    },
  },
};

