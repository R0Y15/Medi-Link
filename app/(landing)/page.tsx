'use client'

import Waves from '@/components/Waves/Waves';
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
    return (
        <div className="min-h-screen relative">
            {/* Content wrapper */}
            <div className="relative z-10 backdrop-blur-sm max-w-7xl mx-auto top-36 rounded-xl border border-gray-200">
                {/* Hero Section */}
                <section className="py-20 px-4 md:px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Modern Healthcare Management
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Streamline your healthcare practice with our comprehensive patient management system
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/sign-in">
                            <Button size="lg">Get Started</Button>
                        </Link>
                        <Link href="/sign-up">
                            <Button variant="outline" size="lg">Sign Up</Button>
                        </Link>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-4 md:px-6">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div key={index} className="p-6 rounded-lg border bg-white shadow-sm">
                                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section
                <section className="py-20 px-4 md:px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Practice?</h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Join thousands of healthcare providers who trust our platform
                        </p>
                        <Link href="/sign-up">
                            <Button size="lg">Start Free Trial</Button>
                        </Link>
                    </div>
                </section> */}
            </div>

            {/* Waves positioned at the bottom */}
            <div className="absolute inset-0 z-0">
                <Waves
                    lineColor="#767676"
                    backgroundColor="rgba(255, 255, 255, 0.2)"
                    waveSpeedX={0.01}
                    waveSpeedY={0.01}
                    waveAmpX={40}
                    waveAmpY={20}
                    friction={0.9}
                    tension={0.01}
                    maxCursorMove={120}
                    xGap={12}
                    yGap={36}
                />
            </div>
        </div>
    )
}

const features = [
    {
        title: "Patient Management",
        description: "Efficiently manage patient records, appointments, and medical histories in one place."
    },
    {
        title: "Smart Analytics",
        description: "Get valuable insights into your practice with advanced analytics and reporting tools."
    },
    {
        title: "Secure & Compliant",
        description: "Built with industry-leading security standards to protect sensitive patient data."
    }
] 