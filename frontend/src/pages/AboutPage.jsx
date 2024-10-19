import { useState } from 'react';
import '../index.css';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

const AboutPage = () => {
    return (
        <>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow p-6">
                    <h1 className="text-3xl font-bold mb-4 text-center">About CollaborGators</h1>
                    <h2 className="text-xl font-semibold mb-2 text-center">Created by Kevin Wagner and ...</h2>
                    <section className="bg-white p-5 rounded-lg shadow-md max-w-3xl mx-auto mt-6">
                        <p className="mt-2 text-gray-700">
                            CollaborGators is cool
						</p>
                    </section>
                </main>
                <Footer />
            </div>
        </>
    );
};

export default AboutPage;
