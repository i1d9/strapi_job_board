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

    async update(ctx){

        const updated_application = await strapi.entityService.update('api::application.application', ctx.request.params.id, {
            data: ctx.request.body
          });
           

        if(ctx.request.body.status == "accepted"){
            let application = await strapi.entityService.create('api::message.message', {
                data: {
                    room: `${ctx.state.user.username}_${ctx.request.body.job_id}_${ctx.request.body.applicant_username}`,
                    texts: [
                        {
                            source: 0,
                            text: "Application accepted"
                        }
                    ]
                }
            });

        }


        ctx.body = updated_application;

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
