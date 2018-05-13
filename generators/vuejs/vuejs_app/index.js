const Generator = require('../../util/generator')

// // // //

module.exports = class VueJsBase extends Generator {
  async write () {

    await this.ensureDir(this.options.build.dest.vue.root)

    await this.copyDir(
      __dirname + '/templates',
      this.options.build.dest.vue.root
    )

  }
}

