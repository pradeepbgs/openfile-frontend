import { useEffect, useState } from 'react';
import { Router, useNavigate } from 'react-router';
import axios from 'axios';
import { useAuth } from '~/zustand/store';
import { toast } from 'sonner';
import { Link } from 'react-router';

const plans = [
    {
        name: 'Free',
        price: '$0',
        description: 'Perfect for light and personal use.',
        features: [
            '5 upload links per day',
            '2 upload per link',
            'Files expire in 24 hr',
            'Basic support',
        ],
        planKey: 'free',
    },
    {
        name: 'Pro',
        price: '$4.99/month',
        description: 'For active users who need flexibility.',
        features: [
            '100 upload links per day',
            '100 uploads per link',
            'Files expire in 15 days',
            '24/7 support',
        ],
        planKey: 'pro',
    },
    // {
    //     name: 'Enterprise',
    //     price: '$4.99/month',
    //     description: 'For teams and high-volume usage.',
    //     features: [
    //         'Unlimited upload links',
    //         '100 uploads per link',
    //         'Files expire in 30 days',
    //         '24/7 support',
    //     ],
    //     planKey: 'enterprise',
    // },
];

export default function PlansPage() {
    const user = useAuth.getState().user;
    const currentPlan = user?.plan;
    const navigate = useNavigate();
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    const handleSelectPlan = async (planKey: string) => {
        try {
            setLoadingPlan(planKey);

            // Map your planKey to price and plan details
            const planDetails: Record<string, { name: string; amount: number }> = {
                free: { name: "Free Plan", amount: 0 },
                pro: { name: "Pro Plan", amount: 499 },
                enterprise: { name: "Enterprise Plan", amount: 499 }
            };

            const selectedPlan = planDetails[planKey];
            if (!selectedPlan) {
                toast.error("Invalid plan selected");
                return;
            }

            const res = await axios.post("http://localhost:8000/api/checkout", {
                customer: {
                    email: "test@example.com",
                    name: "Anonymous User",
                    phone: "+911234567890"
                },
                product_id: 'pdt_ROv1dKJ6PC4gpcRSlAcCq',
                billing: {
                    city: "New Delhi",
                    state: "Delhi",
                    country: "IN",
                    street: "Lado Sarai, near Saket",
                    zipcode: "110030"
                },
                line_items: [
                    {
                        name: selectedPlan.name,
                        amount: selectedPlan.amount,
                        currency: "INR",
                        quantity: 1
                    }
                ],
                metadata: {
                    userId: user?.id.toString(),
                    plan: planKey
                }
            });

            if (res.data?.checkout_url) {
                window.location.href = res.data.checkout_url;
            } else {
                throw new Error("No checkout URL returned from server.");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to initiate checkout.");
        } finally {
            setLoadingPlan(null);
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-8">Choose Your Plan</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`p-6 rounded-2xl shadow-xl transition duration-300 ${currentPlan === plan.planKey
                            ? 'border border-purple-500 bg-white/5 backdrop-blur-md'
                            : 'border border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500'
                            }`}
                    >
                        <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
                        <p className="text-purple-400 text-2xl font-bold mb-4">{plan.price}</p>
                        <p className="text-gray-300 mb-4">{plan.description}</p>
                        <ul className="text-sm space-y-2 text-gray-200">
                            {plan.features.map((f, i) => (
                                <li className="text-green-400" key={i}>
                                    ✓ {f}
                                </li>
                            ))}
                        </ul>

                        {currentPlan === plan.planKey ? (
                            <button
                                disabled
                                className="mt-6 w-full bg-gray-700 text-white/70 py-2 rounded-md cursor-not-allowed"
                            >
                                Your Current Plan
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    if (!user) return navigate('/auth');
                                    return navigate('/plan/checkout')
                                }}
                                className="mt-6 w-full bg-purple-600 hover:bg-purple-700 transition text-white py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >

                                Checkout
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
