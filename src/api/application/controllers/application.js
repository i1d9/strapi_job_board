'use strict';

/**
 * application controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::application.application', ({ strapi }) => ({


    async create(ctx) {


        const files = ctx.request.files;
        let application = await strapi.entityService.create('api::application.application', {
            data: {
                ...ctx.request.body,
                applicant: ctx.state.user.id
            },
            files
        });
        console.log(application)

        ctx.body = application

    },

    async mine(ctx) {

        const applications = await strapi.db.query('api::application.application').findMany({

            where: { applicant: ctx.state.user.id },
            orderBy: { id: 'DESC' },
            populate: {

                job: {
                    populate: {

                        company: {
                            populate: {
                                logo: true
                            }
                        }
                    }
                }

                ,
                cv: true

            },
        });


        console.log(applications[0].job.company);

        ctx.body = applications;
    }



}));
