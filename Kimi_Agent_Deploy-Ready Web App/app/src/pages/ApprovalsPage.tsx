import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle, XCircle, MessageSquare, Clock,
  AlertTriangle
} from 'lucide-react';
import { posts } from '../data/demoData';
import type { Post } from '../data/demoData';

interface ApprovalStep {
  role: string;
  name: string;
  status: 'approved' | 'rejected' | 'pending';
  comment?: string;
  timestamp?: string;
}

const approvalWorkflows: Record<string, ApprovalStep[]> = {
  p4: [
    { role: 'Creator', name: 'Mike Dean', status: 'approved', timestamp: 'Apr 10, 2:00 PM' },
    { role: 'Account Manager', name: 'Anita D.', status: 'approved', comment: 'Looks great! Minor color adjustment needed.', timestamp: 'Apr 11, 10:00 AM' },
    { role: 'Legal Review', name: 'David Park', status: 'pending' },
    { role: 'Client', name: 'Sarah (FitLife)', status: 'pending' },
  ],
  p5: [
    { role: 'Creator', name: 'Brian M.', status: 'approved', timestamp: 'Apr 11, 9:00 AM' },
    { role: 'Account Manager', name: 'Anita D.', status: 'pending' },
    { role: 'Client', name: 'James (FitLife)', status: 'pending' },
  ],
  p6: [
    { role: 'Creator', name: 'Leslie W.', status: 'approved', timestamp: 'Apr 8, 3:00 PM' },
    { role: 'Account Manager', name: 'Anita D.', status: 'approved', timestamp: 'Apr 9, 11:00 AM' },
    { role: 'Client', name: 'Emma (GreenSpace)', status: 'approved', comment: 'Perfect! Love the aesthetic.', timestamp: 'Apr 10, 9:00 AM' },
  ],
};

export default function ApprovalsPage() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [, setApprovalStates] = useState<Record<string, 'approved' | 'rejected'>>({});

  const pendingPosts = posts.filter(p => p.status === 'pending');
  const approvedPosts = posts.filter(p => p.status === 'approved');

  const handleApprove = (postId: string) => {
    setApprovalStates(prev => ({ ...prev, [postId]: 'approved' }));
  };

  const handleReject = (postId: string) => {
    setApprovalStates(prev => ({ ...prev, [postId]: 'rejected' }));
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Approvals</h1>
        <p className="text-gray-500 text-sm mt-1">Review and approve content before publishing.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Pending List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Pending ({pendingPosts.length})</h2>
          {pendingPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedPost(post)}
              className={`bg-white rounded-xl border p-4 cursor-pointer transition-all duration-200 hover:shadow-md
                ${selectedPost?.id === post.id ? 'border-[#6056D3] ring-1 ring-[#6056D3]/20' : 'border-gray-200'}`}
            >
              <div className="flex items-start gap-3">
                {post.image && (
                  <img src={post.image} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{post.client}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-500">{post.platform}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                    {approvalWorkflows[post.id]?.some(s => s.role === 'Legal Review') && (
                      <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3" /> Legal
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mt-8">Recently Approved ({approvedPosts.length})</h2>
          {approvedPosts.slice(0, 2).map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-4 opacity-60"
            >
              <div className="flex items-center gap-3">
                {post.image && (
                  <img src={post.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                  <span className="flex items-center gap-1 text-xs text-green-600 mt-1">
                    <CheckCircle className="w-3 h-3" /> Approved
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right: Approval Detail */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          {selectedPost ? (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Post Preview */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedPost.title}</h2>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm text-gray-500">{selectedPost.client}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-sm text-gray-500">{selectedPost.platform}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-sm text-gray-500">by {selectedPost.author}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReject(selectedPost.id)}
                      className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                    <button
                      onClick={() => handleApprove(selectedPost.id)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#6056D3] text-white rounded-lg text-sm font-medium hover:bg-[#4C45A8] transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                  </div>
                </div>
                {selectedPost.image && (
                  <img src={selectedPost.image} alt="" className="w-full max-h-64 object-cover rounded-lg" />
                )}
              </div>

              {/* Approval Chain */}
              <div className="p-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Approval Workflow</h3>
                <div className="space-y-0">
                  {(approvalWorkflows[selectedPost.id] || []).map((step, i, arr) => (
                    <div key={step.role} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center
                          ${step.status === 'approved' ? 'bg-green-100 text-green-600' :
                            step.status === 'rejected' ? 'bg-red-100 text-red-600' :
                            'bg-gray-100 text-gray-400'}`}>
                          {step.status === 'approved' ? <CheckCircle className="w-4 h-4" /> :
                           step.status === 'rejected' ? <XCircle className="w-4 h-4" /> :
                           <Clock className="w-4 h-4" />}
                        </div>
                        {i < arr.length - 1 && <div className="w-0.5 h-12 bg-gray-200 my-1" />}
                      </div>
                      <div className="pb-6">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{step.role}</span>
                          <span className="text-xs text-gray-500">{step.name}</span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                            ${step.status === 'approved' ? 'bg-green-50 text-green-600' :
                              step.status === 'rejected' ? 'bg-red-50 text-red-600' :
                              'bg-gray-100 text-gray-500'}`}>
                            {step.status}
                          </span>
                        </div>
                        {step.comment && (
                          <div className="mt-2 flex items-start gap-2 bg-gray-50 rounded-lg p-3">
                            <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-600">{step.comment}</p>
                          </div>
                        )}
                        {step.timestamp && (
                          <p className="text-xs text-gray-400 mt-1">{step.timestamp}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 flex items-center justify-center h-96">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Select a post to review the approval workflow</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
