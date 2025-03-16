import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout'; // Ensure this package is installed and correctly imported
import { useRequest } from '../../hooks/useRequest';
import { useRouter } from 'next/router';

const OrderShow = ({ order, currentUser }) => {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(0);
    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id,
        },
        onSuccess: () => router.push('/orders'),
    });

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        };

        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, [order]);

    if (timeLeft < 0) return <div>Order has expired</div>;

    return (
        <div>
            <p>Time left to pay: {timeLeft} seconds</p>
            <StripeCheckout
                token={({ id }) => doRequest({ token: id })}
                stripeKey={process.env.NEXT_PUBLIC_STRIPE_KEY} // Use environment variable for the Stripe key
                amount={order.ticket.price * 100}
                email={currentUser.email}
            />
            {errors}
        </div>
    );
};

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order: data };
};

export default OrderShow;
