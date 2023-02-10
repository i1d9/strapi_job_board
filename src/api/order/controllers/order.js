'use strict';

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({



    async bulk_create(ctx) {




        console.log(ctx.request.body)
        let order_items = ctx.request.body.items
        
        const order = await strapi.entityService.create('api::order.order', {
            data: {
                owner: ctx.state.user.id,
                total: ctx.request.body.total,
                address: ctx.request.body.addres
            },
        });

        
        order_items.map(function (item) {

            return {
                ...item, 
                order: order.id,
                total: item.price * item.quantity,

            }
        }).forEach((item) => {

            strapi.entityService.create('api::order-item.order-item', {
                data: item,
            });
        });





        ctx.body = "ok";
    },



    async mine(ctx) {

        const orders = await strapi.db.query('api::order.order').findMany({

            where: { owner: ctx.state.user.id },
            orderBy: { id: 'DESC' },
            populate: {

                image: true,
                groceries: true

            },
        });

        ctx.body = orders;

    }
}));
