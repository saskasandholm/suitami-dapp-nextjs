'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  Title,
  Text,
  Badge,
  Tab,
  TabList,
  TabGroup,
  TabPanel,
  TabPanels,
} from '@tremor/react';
import { motion } from 'framer-motion';
import {
  BeakerIcon,
  CommandLineIcon,
  PlayIcon,
  StopIcon,
  DocumentIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  PencilSquareIcon,
  ArrowTopRightOnSquareIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  MegaphoneIcon,
  ShieldCheckIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';
import TrainingConfig from './TrainingConfig';
import TrainingHistory from './TrainingHistory';
import Image from 'next/image';

interface TrainingAgent {
  id: string;
  name: string;
  type: string;
  platform: string;
  status: 'not_started' | 'in_progress' | 'completed';
  avatar?: string;
  trainingProgress?: {
    currentEpoch: number;
    totalEpochs: number;
    accuracy: number;
    loss: number;
  };
  recentActions?: AgentAction[];
}

interface AgentAction {
  id: string;
  type: 'reply' | 'post' | 'moderation';
  content: string;
  context?: string;
  timestamp: string;
  platform: string;
  url: string;
  feedback: {
    upvotes: number;
    downvotes: number;
    hasUserVoted?: 'up' | 'down' | null;
    lastVoteTimestamp?: string;
  };
  canEdit: boolean;
  truncatedContent?: string;
  editHistory?: {
    timestamp: string;
    content: string;
  }[];
}

interface TrainingConfiguration {
  learningRate: number;
  batchSize: number;
  epochs: number;
  optimizer: string;
  lossFunction: string;
  modelArchitecture: string;
  datasetSize: number;
  validationSplit: number;
}

// Mock data for recent actions
const mockRecentActions: AgentAction[] = [
  {
    id: '1',
    type: 'reply',
    content:
      'The staking process is straightforward. First, ensure your tokens are in your wallet. Then, go to the staking dashboard and select the amount you wish to stake. The minimum staking amount is 100 tokens.',
    context: "Question: How do I stake my tokens? What's the minimum amount?",
    timestamp: '2 hours ago',
    platform: 'Discord',
    url: 'https://discord.com/channels/123/456/789',
    feedback: {
      upvotes: 12,
      downvotes: 2,
      hasUserVoted: null,
    },
    canEdit: true,
  },
  {
    id: '2',
    type: 'moderation',
    content: 'Removed spam message and issued warning to user',
    context: 'Multiple promotional links posted in #general',
    timestamp: '4 hours ago',
    platform: 'Discord',
    url: 'https://discord.com/channels/123/456/790',
    feedback: {
      upvotes: 8,
      downvotes: 0,
      hasUserVoted: 'up',
    },
    canEdit: false,
  },
  {
    id: '3',
    type: 'post',
    content:
      "🎉 Weekly community update: We've reached 10k members! Join us this Friday at 2 PM UTC for a special AMA session with the core team.",
    timestamp: '1 day ago',
    platform: 'Twitter',
    url: 'https://twitter.com/status/123456789',
    feedback: {
      upvotes: 45,
      downvotes: 3,
      hasUserVoted: null,
    },
    canEdit: true,
  },
];

const initialAgents: TrainingAgent[] = [
  {
    id: '1',
    name: 'Community Manager',
    type: 'Management',
    platform: 'Discord',
    status: 'completed',
    trainingProgress: {
      currentEpoch: 100,
      totalEpochs: 100,
      accuracy: 0.92,
      loss: 0.08,
    },
    recentActions: mockRecentActions,
  },
  {
    id: '2',
    name: 'Support Agent',
    type: 'Support',
    platform: 'Telegram',
    status: 'in_progress',
    trainingProgress: {
      currentEpoch: 45,
      totalEpochs: 100,
      accuracy: 0.78,
      loss: 0.25,
    },
  },
  {
    id: '3',
    name: 'Content Curator',
    type: 'Curation',
    platform: 'X (Twitter)',
    status: 'not_started',
  },
];

export default function TrainingCenter() {
  const [agents, setAgents] = useState<TrainingAgent[]>(initialAgents);
  const [selectedAgent, setSelectedAgent] = useState<TrainingAgent | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedActionType, setSelectedActionType] = useState<string>('all');
  const [selectedAgentType, setSelectedAgentType] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'review' | 'advanced'>('review');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'upvotes' | 'downvotes'>('newest');

  // Combine all actions from all agents
  const allActions = useMemo(() => {
    return agents.flatMap(agent =>
      (agent.recentActions || []).map(action => ({
        ...action,
        agentName: agent.name,
        agentType: agent.type,
        agentId: agent.id,
        isReviewed: action.feedback.hasUserVoted !== null,
      }))
    );
  }, [agents]);

  // Filter actions based on search and filters
  const filteredActions = useMemo(() => {
    let actions = allActions.filter(action => {
      const matchesSearch =
        searchQuery === '' ||
        action.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.agentName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPlatform = selectedPlatform === 'all' || action.platform === selectedPlatform;
      const matchesType = selectedActionType === 'all' || action.type === selectedActionType;
      const matchesAgentType =
        selectedAgentType === 'all' || action.agentType === selectedAgentType;

      return matchesSearch && matchesPlatform && matchesType && matchesAgentType;
    });

    // Add truncated content
    actions = actions.map(action => ({
      ...action,
      truncatedContent:
        action.content.length > 280 ? `${action.content.slice(0, 280)}...` : action.content,
    }));

    // Sort actions
    return actions.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'oldest':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'upvotes':
          return b.feedback.upvotes - a.feedback.upvotes;
        case 'downvotes':
          return b.feedback.downvotes - a.feedback.downvotes;
        default:
          return 0;
      }
    });
  }, [allActions, searchQuery, selectedPlatform, selectedActionType, selectedAgentType, sortBy]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const reviewed = allActions.filter(a => a.isReviewed).length;
    return {
      totalActions: allActions.length,
      reviewedActions: reviewed,
      pendingReview: allActions.length - reviewed,
      positiveVotes: allActions.reduce((sum, a) => sum + a.feedback.upvotes, 0),
      negativeVotes: allActions.reduce((sum, a) => sum + a.feedback.downvotes, 0),
    };
  }, [allActions]);

  const handleVote = (agentId: string, actionId: string, voteType: 'up' | 'down') => {
    setAgents(prev =>
      prev.map(agent => {
        if (agent.id !== agentId) return agent;

        return {
          ...agent,
          recentActions: agent.recentActions?.map(action => {
            if (action.id !== actionId) return action;

            const currentVote = action.feedback.hasUserVoted;
            let { upvotes, downvotes } = action.feedback;

            // Remove previous vote if exists
            if (currentVote === 'up') upvotes--;
            if (currentVote === 'down') downvotes--;

            // Add new vote if different from current
            if (currentVote !== voteType) {
              if (voteType === 'up') upvotes++;
              if (voteType === 'down') downvotes++;
            }

            return {
              ...action,
              feedback: {
                upvotes,
                downvotes,
                hasUserVoted: currentVote === voteType ? null : voteType,
                lastVoteTimestamp: currentVote === voteType ? undefined : new Date().toISOString(),
              },
            };
          }),
        };
      })
    );
  };

  const handleEdit = (actionId: string, content: string) => {
    setIsEditing(actionId);
    setEditedContent(content);
  };

  const saveEdit = (agentId: string, actionId: string) => {
    setAgents(prev =>
      prev.map(agent => {
        if (agent.id !== agentId) return agent;

        return {
          ...agent,
          recentActions: agent.recentActions?.map(action =>
            action.id === actionId
              ? {
                  ...action,
                  content: editedContent,
                  editHistory: [
                    ...(action.editHistory || []),
                    {
                      timestamp: new Date().toISOString(),
                      content: action.content,
                    },
                  ],
                }
              : action
          ),
        };
      })
    );
    setIsEditing(null);
    setEditedContent('');
  };

  const startTraining = (agentId: string) => {
    setAgents(prev => 
      prev.map(agent => 
        agent.id === agentId
          ? {
              ...agent,
              status: 'in_progress',
              trainingProgress: {
                currentEpoch: 0,
                totalEpochs: 100,
                accuracy: 0,
                loss: 1,
              },
            }
          : agent
      )
    );
  };

  const stopTraining = (agentId: string) => {
    setAgents(prev => 
      prev.map(agent => 
        agent.id === agentId
          ? {
              ...agent,
              status: 'completed',
              trainingProgress: {
                ...agent.trainingProgress!,
                currentEpoch: agent.trainingProgress!.totalEpochs,
              },
            }
          : agent
      )
    );
  };

  const handleConfigUpdate = (config: TrainingConfiguration) => {
    // In a real app, this would update the training configuration
    console.log('Training config updated:', config);
  };

  return (
    <div className="space-y-8">
      <TabGroup defaultValue="review">
        <div className="flex items-center justify-between mb-6">
          <TabList className="border-b-0">
            <Tab value="review" className="text-white/70 hover:text-accent">
              <CommandLineIcon className="w-5 h-5 mr-2 inline-block" />
              Review Activity
            </Tab>
            <Tab value="advanced" className="text-white/70 hover:text-accent">
              <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2 inline-block" />
              Advanced Training
            </Tab>
          </TabList>
        </div>

        <TabPanels>
          <TabPanel>
            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card className="glass-card" title="Actions awaiting review from community members">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <ClockIcon className="w-6 h-6 text-yellow-500" aria-hidden="true" />
                  </div>
                  <div>
                    <Text className="text-white/70">Pending Review</Text>
                    <Title className="text-white text-2xl">{metrics.pendingReview}</Title>
                  </div>
                </div>
              </Card>

              <Card className="glass-card" title="Actions that have received community feedback">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <CheckCircleIcon className="w-6 h-6 text-green-500" aria-hidden="true" />
                  </div>
                  <div>
                    <Text className="text-white/70">Reviewed</Text>
                    <Title className="text-white text-2xl">{metrics.reviewedActions}</Title>
                  </div>
                </div>
              </Card>

              <Card className="glass-card" title="Total number of upvotes received">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-green-400/10 flex items-center justify-center">
                    <HandThumbUpIcon className="w-6 h-6 text-green-400" aria-hidden="true" />
                  </div>
                  <div>
                    <Text className="text-white/70">Positive Votes</Text>
                    <Title className="text-white text-2xl">{metrics.positiveVotes}</Title>
                  </div>
                </div>
              </Card>

              <Card className="glass-card" title="Total number of downvotes received">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-red-400/10 flex items-center justify-center">
                    <HandThumbDownIcon className="w-6 h-6 text-red-400" aria-hidden="true" />
                  </div>
                  <div>
                    <Text className="text-white/70">Negative Votes</Text>
                    <Title className="text-white text-2xl">{metrics.negativeVotes}</Title>
                  </div>
                </div>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card className="glass-card p-4 mb-6">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search actions..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:border-accent focus:ring-1 focus:ring-accent"
                      aria-label="Search actions by content or agent name"
                    />
                    <MagnifyingGlassIcon
                      className="w-5 h-5 text-white/50 absolute left-3 top-2.5"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <ArrowsUpDownIcon className="w-5 h-5 text-white/50" aria-hidden="true" />
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value as typeof sortBy)}
                      className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent focus:ring-1 focus:ring-accent"
                      aria-label="Sort actions"
                      title="Sort actions by time or vote count"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="upvotes">Most Upvotes</option>
                      <option value="downvotes">Most Downvotes</option>
                    </select>
                  </div>

                  <select
                    value={selectedPlatform}
                    onChange={e => setSelectedPlatform(e.target.value)}
                    className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent focus:ring-1 focus:ring-accent"
                    aria-label="Filter by platform"
                    title="Filter actions by platform (Discord, Telegram, Twitter)"
                  >
                    <option value="all">All Platforms</option>
                    <option value="Discord">Discord</option>
                    <option value="Telegram">Telegram</option>
                    <option value="Twitter">Twitter</option>
                  </select>

                  <select
                    value={selectedActionType}
                    onChange={e => setSelectedActionType(e.target.value)}
                    className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent focus:ring-1 focus:ring-accent"
                    aria-label="Filter by action type"
                    title="Filter by type of action (replies, posts, moderation)"
                  >
                    <option value="all">All Actions</option>
                    <option value="reply">Replies</option>
                    <option value="post">Posts</option>
                    <option value="moderation">Moderation</option>
                  </select>

                  <select
                    value={selectedAgentType}
                    onChange={e => setSelectedAgentType(e.target.value)}
                    className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent focus:ring-1 focus:ring-accent"
                    aria-label="Filter by agent type"
                    title="Filter by agent role (Management, Support, Curation)"
                  >
                    <option value="all">All Agent Types</option>
                    <option value="Management">Management</option>
                    <option value="Support">Support</option>
                    <option value="Curation">Curation</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Actions List */}
            <div className="space-y-4" role="feed" aria-label="Agent actions feed">
              {filteredActions.map(action => (
                <Card key={action.id} className="glass-card p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center"
                          aria-hidden="true"
                        >
                          {action.type === 'reply' && (
                            <ChatBubbleLeftRightIcon className="w-5 h-5 text-accent transition-colors" />
                          )}
                          {action.type === 'post' && (
                            <MegaphoneIcon className="w-5 h-5 text-accent transition-colors" />
                          )}
                          {action.type === 'moderation' && (
                            <ShieldCheckIcon className="w-5 h-5 text-accent transition-colors" />
                          )}
                        </div>

                        <Badge
                          className="bg-accent/10 text-accent font-medium px-2 py-1 transition-colors"
                          title={`Action type: ${action.type}`}
                        >
                          {action.type.charAt(0).toUpperCase() + action.type.slice(1)}
                        </Badge>

                        <div className="flex items-center space-x-2">
                          <Text className="text-white font-medium">{action.agentName}</Text>
                          <span className="text-white/50" aria-hidden="true">
                            •
                          </span>
                          <Badge
                            className="bg-white/10 text-white/70 font-medium px-2 py-1 transition-colors"
                            title={`Platform: ${action.platform}`}
                          >
                            {action.platform}
                          </Badge>
                        </div>

                        <Text className="text-white/50 ml-auto">{action.timestamp}</Text>

                        {!action.isReviewed && (
                          <Badge
                            className="bg-yellow-500/10 text-yellow-500 font-medium px-2 py-1 transition-colors"
                            title="This action needs community review"
                          >
                            Needs Review
                          </Badge>
                        )}
                      </div>

                      {action.context && (
                        <div className="bg-white/5 p-3 rounded-lg mb-2">
                          <Text className="text-white/70 text-sm italic">
                            <span className="sr-only">Context: </span>
                            {action.context}
                          </Text>
                        </div>
                      )}

                      {isEditing === action.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editedContent}
                            onChange={e => setEditedContent(e.target.value)}
                            className="w-full h-32 bg-black/20 border border-white/10 rounded-lg p-3 text-white resize-none focus:border-accent focus:ring-1 focus:ring-accent"
                            aria-label="Edit response"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => saveEdit(action.agentId, action.id)}
                              className="button-primary text-sm px-3 py-1"
                              title="Save edited response"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setIsEditing(null)}
                              className="button-secondary text-sm px-3 py-1"
                              title="Cancel editing"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Text className="text-white">
                            <span className="sr-only">Response: </span>
                            {action.content.length > 280 ? (
                              <>
                                {action.truncatedContent}
                                <button
                                  onClick={() => setEditedContent(action.content)}
                                  className="text-accent hover:underline ml-2"
                                  title="Show full response"
                                >
                                  Show More
                                </button>
                              </>
                            ) : (
                              action.content
                            )}
                          </Text>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleVote(action.agentId, action.id, 'up')}
                        className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors ${
                          action.feedback.hasUserVoted === 'up'
                            ? 'bg-green-500/20 text-green-500 ring-1 ring-green-500'
                            : 'text-white/70 hover:bg-white/10'
                        }`}
                        title={`Upvote this ${action.type}${
                          action.feedback.hasUserVoted === 'up' ? ' (You upvoted this)' : ''
                        }`}
                        aria-label={`Upvote this ${action.type}${
                          action.feedback.hasUserVoted === 'up' ? ' (Currently upvoted)' : ''
                        }`}
                      >
                        <HandThumbUpIcon className="w-5 h-5" aria-hidden="true" />
                        <span className="font-medium">{action.feedback.upvotes}</span>
                        {action.feedback.hasUserVoted === 'up' && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-1 text-xs"
                            aria-hidden="true"
                          >
                            (Voted)
                          </motion.span>
                        )}
                      </button>
                      <button
                        onClick={() => handleVote(action.agentId, action.id, 'down')}
                        className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors ${
                          action.feedback.hasUserVoted === 'down'
                            ? 'bg-red-500/20 text-red-500 ring-1 ring-red-500'
                            : 'text-white/70 hover:bg-white/10'
                        }`}
                        title={`Downvote this ${action.type}${
                          action.feedback.hasUserVoted === 'down' ? ' (You downvoted this)' : ''
                        }`}
                        aria-label={`Downvote this ${action.type}${
                          action.feedback.hasUserVoted === 'down' ? ' (Currently downvoted)' : ''
                        }`}
                      >
                        <HandThumbDownIcon className="w-5 h-5" aria-hidden="true" />
                        <span className="font-medium">{action.feedback.downvotes}</span>
                        {action.feedback.hasUserVoted === 'down' && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-1 text-xs"
                            aria-hidden="true"
                          >
                            (Voted)
                          </motion.span>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      {action.canEdit && !isEditing && (
                        <button
                          onClick={() => handleEdit(action.id, action.content)}
                          className="p-2 text-white/70 hover:bg-white/10 rounded-lg transition-colors group relative"
                          title="Edit this response (Alt + E)"
                          aria-label="Edit response"
                        >
                          <PencilSquareIcon
                            className="w-5 h-5 transition-colors"
                            aria-hidden="true"
                          />
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Edit Response (Alt + E)
                          </span>
                        </button>
                      )}
                      <a
                        href={action.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-white/70 hover:bg-white/10 rounded-lg transition-colors group relative"
                        title="View original content (opens in new tab)"
                        aria-label={`View original ${action.type} on ${action.platform} (opens in new tab)`}
                      >
                        <ArrowTopRightOnSquareIcon
                          className="w-5 h-5 transition-colors"
                          aria-hidden="true"
                        />
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          View Original
                        </span>
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabPanel>

          <TabPanel>
            {/* Advanced Training View */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`glass-card hover-accent cursor-pointer ${
                selectedAgent?.id === agent.id ? 'border-accent' : ''
              }`}
              onClick={() => setSelectedAgent(agent)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-[#87fafd]/10 flex items-center justify-center mr-4 overflow-hidden">
                    {agent.avatar ? (
                            <Image
                        src={agent.avatar} 
                        alt={agent.name}
                              width={48}
                              height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <CommandLineIcon className="w-6 h-6 text-accent" />
                    )}
                  </div>
                  <div>
                    <Title className="text-white">{agent.name}</Title>
                    <Text className="text-white/70">{agent.type}</Text>
                  </div>
                </div>
                <Badge
                  className={`${
                    agent.status === 'completed'
                      ? 'bg-green-400/10 text-green-400'
                      : agent.status === 'in_progress'
                      ? 'bg-yellow-400/10 text-yellow-400'
                      : 'bg-white/10 text-white/70'
                  }`}
                >
                        {agent.status
                          .split('_')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')}
                </Badge>
              </div>

                    {agent.trainingProgress && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <Text className="text-white/70">
                            Epoch {agent.trainingProgress.currentEpoch} of{' '}
                            {agent.trainingProgress.totalEpochs}
                          </Text>
                          <Text className="text-white/70">
                            {(
                              (agent.trainingProgress.currentEpoch /
                                agent.trainingProgress.totalEpochs) *
                              100
                            ).toFixed(0)}
                            %
                          </Text>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-accent"
                            initial={{ width: '0%' }}
                            animate={{
                              width: `${(agent.trainingProgress.currentEpoch / agent.trainingProgress.totalEpochs) * 100}%`,
                            }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="text-center">
                            <Text className="text-white/70 text-sm">Accuracy</Text>
                            <Text className="text-white">
                              {(agent.trainingProgress.accuracy * 100).toFixed(1)}%
                            </Text>
                          </div>
                          <div className="text-center">
                            <Text className="text-white/70 text-sm">Loss</Text>
                            <Text className="text-white">
                              {agent.trainingProgress.loss.toFixed(3)}
                            </Text>
                          </div>
                        </div>
                      </div>
                    )}

              <div className="flex items-center justify-between">
                <Text className="text-white/70">Platform: {agent.platform}</Text>
                {agent.status === 'not_started' && (
                  <button
                          onClick={e => {
                      e.stopPropagation();
                      startTraining(agent.id);
                    }}
                    className="button-primary flex items-center text-sm px-3 py-1"
                  >
                    <PlayIcon className="w-4 h-4 mr-1" />
                    Start Training
                  </button>
                )}
                {agent.status === 'in_progress' && (
                  <button
                          onClick={e => {
                      e.stopPropagation();
                      stopTraining(agent.id);
                    }}
                    className="button-primary flex items-center text-sm px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border-red-500/30"
                  >
                    <StopIcon className="w-4 h-4 mr-1" />
                    Stop Training
                  </button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedAgent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <TrainingConfig agentId={selectedAgent.id} onConfigUpdate={handleConfigUpdate} />
                  <Card className="glass-card">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-lg bg-[#87fafd]/10 flex items-center justify-center mr-4">
                          <DocumentIcon className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <Title className="text-white">Knowledge Integration</Title>
                          <Text className="text-white/70">Connect training data sources</Text>
                        </div>
                      </div>
                      <Badge className="bg-accent/10 text-accent">{selectedAgent.type}</Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="glass-card p-4 hover-accent cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <Text className="text-white font-medium">Community Guidelines</Text>
                          <Badge className="bg-green-400/10 text-green-400">Connected</Badge>
                        </div>
                        <Text className="text-white/70 text-sm">
                          Core community rules and moderation guidelines
                        </Text>
                      </div>

                      <div className="glass-card p-4 hover-accent cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <Text className="text-white font-medium">FAQ Database</Text>
                          <Badge className="bg-green-400/10 text-green-400">Connected</Badge>
                        </div>
                        <Text className="text-white/70 text-sm">
                          Frequently asked questions and answers
                        </Text>
                      </div>

                      <div className="glass-card p-4 hover-accent cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <Text className="text-white font-medium">Custom Responses</Text>
                          <Badge className="bg-white/10 text-white/70">Optional</Badge>
                        </div>
                        <Text className="text-white/70 text-sm">
                          Predefined responses for common scenarios
                        </Text>
                      </div>

                      <button className="button-primary w-full mt-4">Add Knowledge Source</button>
                </div>
                  </Card>
                </div>
                <TrainingHistory agentId={selectedAgent.id} />
              </motion.div>
            )}
              </TabPanel>
            </TabPanels>
          </TabGroup>
    </div>
  );
} 
