const Helpers = require('../util/helpers')
const BlazeplateGenerator = require('../util/generator')
const Generators = require('./generators')

// // // //

module.exports = class extends BlazeplateGenerator {

  // constructor
  // Sets required input parameters
  constructor(options) {

    // Invokes super
    super(options)

    // // // //
    // TODO - abstract this into helpers.js

    // Global build configuration
    let build = {
      dest: {
        id: '',
        root: null,
        out: '',
        vue: {},
        expressjs: {}
      }
    }

    // Assigngs build.app from options
    build.app = options['appconfig']

    // Isolates the buildId
    const buildId = options['buildId']
    build.id = buildId

    // // // //
    // Destination helpers & constants
    // TODO - use this.env.cwd & path library, instead of hardcoded relative path
    build.dest.out = './build/' + buildId + '/'
    build.dest.root = build.dest.out + build.app.identifier + '/'

    // VueJS
    // TODO - move into the Vue generator
    build.dest.vue.root = build.dest.root + 'web_client/'
    build.dest.vue.src = build.dest.vue.root + 'src/'

    // ExpressJS
    // TODO - move into the ExpressJs generator
    build.dest.expressjs.root = build.dest.root + 'web_api/'

    //
    // // // //

    // Sets this.options.build
    this.options = { build: Helpers.formatBuild(build) }

    // Returns the generator instance
    return this

  }

  // TODO - integrate into write() method
  async writeBuildManifest (req, buildId) {
    return new Promise((resolve, reject) => {

      // Makes /build/buildId
      this.fs.mkdirSync(__dirname + `/build/${buildId}`)

      // Writes blazeplate.json file
      this.fs.writeFile(__dirname + `/build/${buildId}/blazeplate.json`, JSON.stringify(req.body, null, 2), (err) => {
        if (err) throw err;
        // console.log(`Build ${buildId} manfiest saved`);
        return resolve()
      });

    });

  }

  // TODO - update to conditionally run each generator
  async write () {

    console.log('Starting Blazeplate generate')
    // console.log(this.options)

    // TODO - write build configuration to JSON file
    // await fs.writeFileSync(outputFile, this.options)

    // Creates project build directories
    await this.ensureDir(this.options.build.dest.root)

    // Client - VueJS
    await this.composeWith(Generators.VueJS)

    // Server - ExpressJS
    await this.composeWith(Generators.ExpressJS)

    // Infrastructure & Seed Data
    await this.composeWith(Generators.SeedData);
    await this.composeWith(Generators.DockerCompose);

    // TODO - implement a more robust logging solution
    console.log('Finished Blazeplate generate')

  }

};
