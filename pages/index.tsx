import Layout from '../components/Layout';

export default function Home() {
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-800">Home</h1>
                <p className="mt-4 text-gray-600">Welcome to your AI Diet Planner</p>
            </div>
        </Layout>
    );
}
