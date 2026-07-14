import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import api from '../api/client';
import { useAuthStore } from '../stores/authStore';

interface Approval {
  id: string;
  status: string;
  tier: string;
  notes: string;
  createdAt: string;
  post: {
    id: string;
    title: string;
    content: string;
    author: { name: string; avatar: string };
    workspace: { client: { name: string } };
  };
  requestedBy: { name: string };
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      const response = await api.get('/approvals/pending');
      setApprovals(response.data.approvals);
    } catch (error) {
      console.error('Failed to fetch approvals', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (postId: string, action: 'approve' | 'reject') => {
    setActioning(postId);
    try {
      await api.post(`/approvals/${postId}/review`, { action, comments: `Reviewed by ${user?.name}` });
      // Remove from list
      setApprovals(prev => prev.filter(a => a.post.id !== postId));
    } catch (error) {
      console.error(`Failed to ${action} post`, error);
    } finally {
      setActioning(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Approvals Queue</h1>
        <p className="text-gray-500 mt-1">Review and approve content before it goes live.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6056D3]"></div>
        </div>
      ) : approvals.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">You're all caught up!</h3>
          <p className="text-gray-500 mt-1">There are no pending approvals in your queue.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {approvals.map((approval) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={approval.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                      {approval.post.author.avatar || approval.post.author.name[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{approval.post.workspace.client.name}</h3>
                      <p className="text-xs text-gray-500">
                        Requested by {approval.requestedBy.name} • {new Date(approval.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                    <Clock className="w-3 h-3" />
                    Pending {approval.tier === 'LEGAL_REVIEWER' ? 'Legal' : 'Client'} Review
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">{approval.post.title}</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{approval.post.content}</p>
                </div>

                {approval.notes && (
                  <div className="flex gap-2 text-sm text-gray-600 mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p><span className="font-semibold">Note from requester:</span> {approval.notes}</p>
                  </div>
                )}

                <div className="flex gap-3 justify-end border-t border-gray-100 pt-4 mt-4">
                  <button
                    onClick={() => handleReview(approval.post.id, 'reject')}
                    disabled={actioning === approval.post.id}
                    className="px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    Needs Revision
                  </button>
                  <button
                    onClick={() => handleReview(approval.post.id, 'approve')}
                    disabled={actioning === approval.post.id}
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm shadow-green-500/30 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve Content
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
