'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export function JobStatus({ jobId, onReset }: { jobId: number, onReset: () => void }) {
    // Poll every 2 seconds
    const { data: job, isLoading, error } = useQuery({
        queryKey: ['job', jobId],
        queryFn: async () => {
            const res = await api.get(`/jobs/${jobId}`);
            return res.data;
        },
        refetchInterval: (query) => {
            return query.state.data?.status === 'completed' || query.state.data?.status === 'failed' ? false : 2000;
        }
    });

    if (isLoading) return <div className="text-white text-center animate-pulse">Loading status...</div>;
    if (error) return <div className="text-red-400 text-center">Failed to load job status.</div>;

    const isPending = job.status === 'pending';
    const isProcessing = job.status === 'processing';
    const isCompleted = job.status === 'completed';
    const isFailed = job.status === 'failed';

    return (
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl p-8 transition-all">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Analysis Result</h3>
                <span className={cn(
                    "px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wider",
                    isPending && "bg-yellow-500/20 text-yellow-300",
                    isProcessing && "bg-blue-500/20 text-blue-300 animate-pulse",
                    isCompleted && "bg-green-500/20 text-green-300",
                    isFailed && "bg-red-500/20 text-red-300"
                )}>
                    {job.status}
                </span>
            </div>

            <div className="space-y-6">
                <div>
                    <h4 className="text-sm text-gray-400 mb-1">Target URL</h4>
                    <p className="text-blue-300 truncate">{job.url}</p>
                </div>
                <div>
                    <h4 className="text-sm text-gray-400 mb-1">Question</h4>
                    <p className="text-white text-lg">{job.question}</p>
                </div>

                {job.answer && (
                    <div className="bg-black/30 p-6 rounded-xl border border-white/10">
                        <h4 className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" /> AI Answer
                        </h4>
                        <p className="text-gray-100 whitespace-pre-wrap leading-relaxed">{job.answer}</p>
                    </div>
                )}

                {isProcessing && (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-300 space-y-4">
                        <Loader2 className="w-12 h-12 animate-spin text-purple-400" />
                        <p>Scraping website and consulting Gemini...</p>
                    </div>
                )}

                {isFailed && (
                    <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-red-200">
                        Error: {job.error || "Unknown error occurred"}
                    </div>
                )}
            </div>

            <div className="mt-8 flex justify-center">
                <button
                    onClick={onReset}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                    Ask Another Question
                </button>
            </div>
        </div>
    );
}
