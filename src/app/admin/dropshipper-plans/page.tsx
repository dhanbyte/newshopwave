// src/app/admin/dropshipper-plans/page.tsx
'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Check, Store, Globe, Package } from 'lucide-react';
import styles from '../../dropshipper/plans/page.module.css';

interface DropshipperPlan {
  id: string;
  name: string;
  interval: 'weekly' | 'monthly' | 'yearly';
  price: number;
  description: string;
  discount: number;
}

// Simple fetcher for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const getPlanFeatures = (planId: string) => {
  const baseFeatures = [
    { icon: Check, text: 'Wholesale pricing' },
    { icon: Check, text: 'No inventory needed' },
    { icon: Check, text: '24/7 support' },
  ];

  if (planId === 'plan_yearly') {
    return [...baseFeatures, { icon: Check, text: 'Priority customer support' }];
  }
  if (planId === 'plan_premium') {
    return [
      ...baseFeatures,
      { icon: Check, text: 'Priority customer support' },
      { icon: Store, text: 'Shopify store setup' },
      { icon: Globe, text: 'Free subdomain' },
      { icon: Package, text: 'Product listing service' },
    ];
  }
  return baseFeatures;
};

const isPopular = (planId: string) => planId === 'plan_monthly';

export default function AdminDropshipperPlans() {
  const { data, error, isLoading } = useSWR('/api/dropshipper/plans', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000,
  });

  if (isLoading) return <div className={styles.loading}>Loading plans…</div>;
  if (error) return <div className={styles.error}>Error loading plans.</div>;

  const plans: DropshipperPlan[] = data?.plans || [];

  return (
    <main className={styles.plansPage}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Admin – Dropshipper Plans</h1>
        <p className={styles.subtitle}>Manage available subscription plans for dropshippers.</p>
      </section>
      <div className={styles.cardsWrapper}>
        <section className={styles.cardsContainer}>
          {plans.map((plan) => {
            const features = getPlanFeatures(plan.id);
            const popular = isPopular(plan.id);
            return (
              <article
                key={plan.id}
                className={`${styles.planCard} ${popular ? styles.popular : ''} ${plan.id === 'plan_premium' ? styles.premium : ''}`}
              >
                {plan.discount && (
                  <div className={styles.discountBadge}>{plan.discount}% OFF</div>
                )}
                {popular && (
                  <div className={styles.popularBadge}>POPULAR</div>
                )}
                {plan.id === 'plan_premium' && (
                  <div className={styles.premiumBadge}>⭐ BEST VALUE</div>
                )}
                <div className={styles.planHeader}>
                  <h3 className={styles.planName}>{plan.name}</h3>
                  <p className={styles.planDesc}>{plan.description}</p>
                  <div className={styles.priceSection}>
                    <span className={styles.currency}>₹</span>
                    <span className={styles.price}>{plan.price}</span>
                    <span className={styles.period}>/{plan.interval}</span>
                  </div>
                </div>
                <div className={styles.features}>
                  {features.map((feature, idx) => (
                    <div key={idx} className={styles.feature}>
                      <feature.icon className={styles.checkIcon} size={16} />
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
                {/* Admin actions could be added here, e.g., Edit/Delete buttons */}
                <button className={styles.ctaButton} disabled>
                  Edit (Coming Soon)
                </button>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
