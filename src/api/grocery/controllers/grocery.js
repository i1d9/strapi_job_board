'use strict';

/**
 * grocery controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::grocery.grocery', ({strapi})=>({



     async mine(ctx) {

        const orders = await strapi.db.query('api::property.property').findMany({

            where: { owner: ctx.state.user.id },
            orderBy: { id: 'DESC' },
            populate: {

                image: true,
                groceries: true

            },
        });

        ctx.body = properties;

    }
}));
