const Generator = require('../../util/generator')

// // // //

module.exports = class ExpressJsResources extends Generator {
  async write () {

    // Destination helpers & constants
    let dest = this.options.build.dest.expressjs.root

    // Iterates over each schema in the this.options.build.app.schemas array
    for (var i = this.options.build.app.schemas.length - 1; i >= 0; i--) {

      // Isolates the individual schema
      let schema = this.options.build.app.schemas[i]

      // Defines the schema-specific destination
      let resourceDest = dest + 'server/api/' + schema.identifier

      // Ensures the presence of the directory
      await this.ensureDir(resourceDest)

      // server/api/resource/resource.model.js
      // TODO - find related schemas BEFORE rendering this template
      // let relatedSchema = _.find(allSchemas, { _id: attr.datatypeOptions.schema_id })
      if (schema.identifier === 'user') {
        await this.copyTemplate(
          this.templatePath(__dirname, 'user.resource.model.js'),
          resourceDest + '/' + schema.identifier + '.model.js',
          { schema: schema }
        );
      } else {
        await this.copyTemplate(
          this.templatePath(__dirname, 'resource.model.js'),
          resourceDest + '/' + schema.identifier + '.model.js',
          { schema: schema }
        );
      }

      // server/api/resource/resource.controller.js
      await this.copyTemplate(
        this.templatePath(__dirname, 'resource.controller.js'),
        resourceDest + '/' + schema.identifier + '.controller.js',
        { schema: schema }
      );

      // server/api/resource/index.js
      await this.copyTemplate(
        this.templatePath(__dirname, 'index.js'),
        resourceDest + '/index.js',
        { schema: schema }
      );

    } // End loop
  }

};