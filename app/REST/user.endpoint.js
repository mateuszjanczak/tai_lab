import applicationException from '../service/applicationException';
import business from '../business/business.container'

const userEndpoint = (router) => {
    router.get('/api/test', async (request, response, next) => {
        try {
            response.status(200).send('Test - ok');
        } catch (error) {
            console.log(error)
        }
    });

    router.post('/api/user/auth', async (request, response, next) => {
        try {
            let result = await business.getUserManager(request).authenticate(request.body.login, request.body.password);
            response.status(200).send(result);
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
    });

    router.post('/api/user/create', async (request, response, next) => {
        try {
            const result = await business.getUserManager(request).createNewOrUpdate(request.body);
            response.status(200).send(result);
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
    });

    router.delete('/api/user/logout/:userId', async (request, response, next) => {
        try {
            let result = await business.getUserManager(request).removeHashSession(request.body.userId);
            response.status(200).send(result);
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
    });
};

export default userEndpoint;
