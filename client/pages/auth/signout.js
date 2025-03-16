import { useEffect } from 'react';
import { useRequest } from '../../hooks/useRequest';
import { useRouter } from 'next/router';

const Signout = () => {
    const router = useRouter();
    const { doRequest } = useRequest({
        url: '/api/users/signout',
        method: 'post',
        body: {},
        onSuccess: () => {
            router.push('/');
        },
    });

    useEffect(() => {
        doRequest();
    }, []);

    return <div>Signing you out...</div>;
};

export default Signout;
