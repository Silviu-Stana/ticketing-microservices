import axios from 'axios';

const buildClient = ({ req }) => {
    if (typeof window === 'undefined') {
        //We are on the server
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers,
        });
    } else {
        //We are on the client (browser)
        return axios.create({
            baseURL: '/',
            // headers: req.headers,
            //We do not need to include any headers cause the browser will take care of that for us.
        });
    }
};

export default buildClient;
