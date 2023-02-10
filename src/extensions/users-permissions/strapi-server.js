module.exports = (plugin) => {

    plugin.controllers.auth.saveProfile = async (ctx) => {

        const files = ctx.request.files;
        var res = await strapi.entityService.update(

            'plugin::users-permissions.user', ctx.state.user.id, {
            data: { ...ctx.request.body },
            files

        });

        ctx.body = res;
    };


  


    plugin.routes['content-api'].routes.push({
        method: 'POST',
        path: '/auth/local/profile',
        handler: 'auth.saveProfile',
        config: {

            prefix: '',
            policies: []
        }
    });

    return plugin;
};