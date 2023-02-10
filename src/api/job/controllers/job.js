'use strict';

/**
 * job controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::job.job', ({ strapi }) => ({



    async myJobs(ctx) {


        const company = await strapi.db.query('api::company.company').findOne({

            where: { representative: ctx.state.user.id },
            populate: {
                jobs: {
                    populate: {
                        applications: {
                            populate: {
                                cv: true,
                                applicant: {
                                    select: ['first_name', 'last_name', 'phone_number', 'email', 'id']
                                }
                            }
                        }
                    }
                }
            }
        });



        ctx.body = company.jobs;
    }


}));
