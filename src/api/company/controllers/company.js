'use strict';

/**
 * company controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::company.company', ({ strapi }) => ({



    async create(ctx) {



        const files = ctx.request.files;
        let company = await strapi.entityService.create('api::company.company', {
            data: {
                ...ctx.request.body,
                representative: ctx.state.user.id
            },
            files
        });
        ctx.body = company;

    },

    async myProfile(ctx) {



        const company = await strapi.db.query('api::company.company').findOne({
            where: { representative: ctx.state.user.id },
            populate: { logo: true },
        });



        ctx.body = company;


    }

}));
