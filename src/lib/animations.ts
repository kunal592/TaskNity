'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Hook for fade-in-up animation on mount
export function useFadeInUp(delay = 0) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            gsap.fromTo(
                ref.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, delay, ease: 'power3.out' }
            );
        }
    }, [delay]);

    return ref;
}

// Hook for staggered children animation
export function useStaggerChildren(staggerDelay = 0.1) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            const children = containerRef.current.children;
            gsap.fromTo(
                children,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: staggerDelay,
                    ease: 'power2.out',
                }
            );
        }
    }, [staggerDelay]);

    return containerRef;
}

// Hook for scale-in animation
export function useScaleIn(delay = 0) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            gsap.fromTo(
                ref.current,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.5, delay, ease: 'back.out(1.7)' }
            );
        }
    }, [delay]);

    return ref;
}

// Hook for slide in from left
export function useSlideInLeft(delay = 0) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            gsap.fromTo(
                ref.current,
                { opacity: 0, x: -50 },
                { opacity: 1, x: 0, duration: 0.6, delay, ease: 'power3.out' }
            );
        }
    }, [delay]);

    return ref;
}

// Hook for slide in from right
export function useSlideInRight(delay = 0) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            gsap.fromTo(
                ref.current,
                { opacity: 0, x: 50 },
                { opacity: 1, x: 0, duration: 0.6, delay, ease: 'power3.out' }
            );
        }
    }, [delay]);

    return ref;
}

// Function for hover scale effect
export function applyHoverScale(element: HTMLElement, scale = 1.05) {
    element.addEventListener('mouseenter', () => {
        gsap.to(element, { scale, duration: 0.2, ease: 'power2.out' });
    });
    element.addEventListener('mouseleave', () => {
        gsap.to(element, { scale: 1, duration: 0.2, ease: 'power2.out' });
    });
}

// Count-up animation for numbers
export function animateNumber(
    element: HTMLElement,
    endValue: number,
    duration = 1.5,
    prefix = '',
    suffix = ''
) {
    const obj = { value: 0 };
    gsap.to(obj, {
        value: endValue,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
            element.textContent = `${prefix}${Math.round(obj.value)}${suffix}`;
        },
    });
}
