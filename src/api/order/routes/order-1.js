module.exports = {
    routes: [
        { // Path defined with a regular expression
            method: 'GET',
            path: '/orders/mine', // Only match when the URL parameter is composed of lowercase letters
            handler: 'order.mine',

        },
        { // Path defined with a regular expression
            method: 'POST',
            path: '/orders/test', // Only match when the URL parameter is composed of lowercase letters
            handler: 'order.bulk_create',

        }
    ]
}