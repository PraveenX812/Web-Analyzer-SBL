'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Loader2, Send } from 'lucide-react';

export function JobForm({ onJobCreated }: { onJobCreated: (id: number) => void }) {
    const [url, setUrl] = useState('');
    const [question, setQuestion] = useState('');

    const mutation = useMutation({
        mutationFn: async () => {
            const res = await api.post('/jobs', { url, question });
            return res.data;
        },
        onSuccess: (data) => {
            onJobCreated(data.id);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate();
    }

    return (
        <div className="w-full max-w-lg p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
            <h2 className="text-3xl font-bold mb-6 text-white text-center">Analyze Web</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">Website URL</label>
                    <input
                        type="url"
                        required
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">Your Question</label>
                    <input
                        type="text"
                        required
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="What is the pricing?"
                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 outline-none transition-all"
                    />
                </div>

                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all flex items-center justify-center gap-2 group"
                >
                    {mutation.isPending ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <>
                            Start Analysis <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
                {mutation.isError && (
                    <p className="text-red-400 text-sm text-center">Something went wrong. Check URL and try again.</p>
                )}
            </form>
        </div>
    )
}
