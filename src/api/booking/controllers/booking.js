'use strict';

/**
 * booking controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::booking.booking', ({ strapi }) => ({

    async create(ctx) {

        let booking = await strapi.entityService.create('api::booking.booking', {
            data: {
                ...ctx.request.body,
                user: ctx.state.user.id,
            }
        });
        ctx.body = booking;

    }, async find(ctx) {



        const booking_entries = await strapi.db.query('api::booking.booking').findMany({

            where: { user: ctx.state.user.id },
            orderBy: { id: 'DESC' },
            populate: {
                property: {
                    populate: {
                        picture: true,
                    }
                }
            },
        });

        ctx.body = booking_entries;

    },
    async findOne(ctx) {



        const { id } = ctx.params;

        const entry = await strapi.entityService.findOne('api::booking.booking', id, {
            where: { user: ctx.state.user.id },
            populate: { property: true },
        });



        ctx.body = entry;

    }



}));
