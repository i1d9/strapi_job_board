'use strict';

/**
 * property controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::property.property', ({ strapi }) => ({


    async create(ctx) {

        const files = ctx.request.files;
        let property = await strapi.entityService.create('api::property.property', {
            data: {
                ...ctx.request.body,
                owner: ctx.state.user.id,
                contact_email: ctx.state.user.email
            },
            files
        });
        ctx.body = property;

    }, async mine(ctx) {

        const properties = await strapi.db.query('api::property.property').findMany({

            where: { owner: ctx.state.user.id },
            orderBy: { id: 'DESC' },
            populate: {

                picture: true,
                features: true

            },
        });

        ctx.body = properties;

    }
}));
