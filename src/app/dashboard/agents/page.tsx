'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  FunnelIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  RocketLaunchIcon,
  CommandLineIcon,
  GlobeAltIcon,
  PaperAirplaneIcon,
  Squares2X2Icon,
  ListBulletIcon,
  CircleStackIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';
import { DiscordLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';

export default function AgentsPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  const [activePlatformFilter, setActivePlatformFilter] = useState('all');
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data for agents
  const agents = [
    {
      id: 1,
      name: 'Community Manager AI',
      description: 'Manages community engagement and moderates discussions',
      platform: 'discord',
      useCase: 'community',
      status: 'active',
      avatar: '/avatars/community-manager.png',
      metrics: {
        messages: 1234,
        engagement: '87%',
        response_time: '30s',
      },
    },
    {
      id: 2,
      name: 'Social Media Assistant',
      description: 'Handles social media interactions and content scheduling',
      platform: 'twitter',
      useCase: 'engagement',
      status: 'active',
      avatar: '/avatars/social-assistant.png',
      metrics: {
        messages: 856,
        engagement: '92%',
        response_time: '45s',
      },
    },
    {
      id: 3,
      name: 'Telegram Support Bot',
      description: 'Provides customer support and handles inquiries',
      platform: 'telegram',
      useCase: 'community',
      status: 'active',
      avatar: '/avatars/support-bot.png',
      metrics: {
        messages: 567,
        engagement: '85%',
        response_time: '25s',
      },
    },
    // Add more mock agents as needed
  ];

  const useCaseFilters = [
    { id: 'all', name: 'All', icon: CommandLineIcon },
    { id: 'community', name: 'Community', icon: UserGroupIcon },
    { id: 'engagement', name: 'Engagement', icon: ChatBubbleLeftRightIcon },
  ];

  const platformFilters = [
    { id: 'all', name: 'All', icon: GlobeAltIcon },
    { id: 'discord', name: 'Discord', icon: DiscordLogoIcon },
    { id: 'twitter', name: 'Twitter', icon: TwitterLogoIcon },
    { id: 'telegram', name: 'Telegram', icon: PaperAirplaneIcon },
  ];

  const deploymentTemplates = [
    {
      id: 'community-manager',
      name: 'Community Manager',
      description: 'AI agent specialized in community management and moderation',
      platforms: ['discord', 'twitter'],
      useCase: 'community',
    },
    {
      id: 'engagement-specialist',
      name: 'Engagement Specialist',
      description: 'Focused on increasing social media engagement and interaction',
      platforms: ['twitter', 'instagram', 'linkedin'],
      useCase: 'engagement',
    },
  ];

  // Create a reusable avatar component
  const AgentAvatar = ({ agent }: { agent: (typeof agents)[0] }) => (
    <div className="relative w-12 h-12 shrink-0">
      <div className="absolute inset-0 rounded-full ring-2 ring-white/10" />
      <div className="absolute inset-0 rounded-full overflow-hidden bg-accent/10 flex items-center justify-center">
        <CpuChipIcon className="w-6 h-6 text-accent" />
      </div>
    </div>
  );

  const handleViewDetails = (agentId: number) => {
    router.push(`/dashboard/agents/${agentId}`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Agents</h1>
          <p className="page-description">Manage and monitor your AI agents</p>
        </div>
        <button
          onClick={() => setShowDeployModal(true)}
          className="button-deploy flex items-center px-4 py-2"
        >
          <CommandLineIcon className="w-5 h-5 mr-2" />
          Deploy New Agent
        </button>
      </div>

      <div className="glass-card">
        <div className="p-4 border-b border-white/10">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 sm:items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-white/70 mb-2">Use Case</label>
              <div className="flex space-x-2 overflow-x-auto">
                {useCaseFilters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex items-center px-3 py-1.5 rounded-lg border text-sm ${
                      activeFilter === filter.id
                        ? 'border-accent text-accent bg-accent/10'
                        : 'border-white/10 text-white/70 hover:border-white/20'
                    }`}
                  >
                    <filter.icon className="w-4 h-4 mr-1.5" />
                    {filter.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-white/70 mb-2">Platform</label>
              <div className="flex space-x-2 overflow-x-auto">
                {platformFilters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setActivePlatformFilter(filter.id)}
                    className={`flex items-center px-3 py-1.5 rounded-lg border text-sm ${
                      activePlatformFilter === filter.id
                        ? 'border-accent text-accent bg-accent/10'
                        : 'border-white/10 text-white/70 hover:border-white/20'
                    }`}
                  >
                    <filter.icon className="w-4 h-4 mr-1.5" />
                    {filter.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg border ${
                  viewMode === 'grid'
                    ? 'border-accent text-accent bg-accent/10'
                    : 'border-white/10 text-white/70 hover:border-white/20'
                }`}
              >
                <Squares2X2Icon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg border ${
                  viewMode === 'list'
                    ? 'border-accent text-accent bg-accent/10'
                    : 'border-white/10 text-white/70 hover:border-white/20'
                }`}
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents
                .filter(
                  agent =>
                    (activeFilter === 'all' || agent.useCase === activeFilter) &&
                    (activePlatformFilter === 'all' || agent.platform === activePlatformFilter)
                )
                .map(agent => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-accent/50 transition-colors"
                  >
                    <div className="flex items-start space-x-3 mb-6">
                      <AgentAvatar agent={agent} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-medium text-white truncate pr-2">
                            {agent.name}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              agent.status === 'active'
                                ? 'bg-green-500/10 text-green-500'
                                : 'bg-yellow-500/10 text-yellow-500'
                            }`}
                          >
                            {agent.status}
                          </span>
                        </div>
                        <p className="text-white/50 text-sm mt-1 line-clamp-2">
                          {agent.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="text-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <p className="text-xs text-white/50 mb-1">Messages</p>
                        <p className="text-lg font-medium text-accent">{agent.metrics.messages}</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <p className="text-xs text-white/50 mb-1">Engagement</p>
                        <p className="text-lg font-medium text-accent">
                          {agent.metrics.engagement}
                        </p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <p className="text-xs text-white/50 mb-1">Response</p>
                        <p className="text-lg font-medium text-accent">
                          {agent.metrics.response_time}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button className="button-secondary text-sm w-full">Configure</button>
                      <button
                        onClick={() => handleViewDetails(agent.id)}
                        className="button-primary text-sm w-full"
                      >
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
            </div>
          ) : (
            <div className="space-y-4">
              {agents
                .filter(
                  agent =>
                    (activeFilter === 'all' || agent.useCase === activeFilter) &&
                    (activePlatformFilter === 'all' || agent.platform === activePlatformFilter)
                )
                .map(agent => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-accent/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <AgentAvatar agent={agent} />
                        <div>
                          <h3 className="text-lg font-medium text-white">{agent.name}</h3>
                          <p className="text-white/50 text-sm">{agent.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="flex space-x-4">
                          <div className="text-center">
                            <p className="text-xs text-white/50">Messages</p>
                            <p className="text-sm font-medium text-accent">
                              {agent.metrics.messages}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-white/50">Engagement</p>
                            <p className="text-sm font-medium text-accent">
                              {agent.metrics.engagement}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-white/50">Response</p>
                            <p className="text-sm font-medium text-accent">
                              {agent.metrics.response_time}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            agent.status === 'active'
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-yellow-500/10 text-yellow-500'
                          }`}
                        >
                          {agent.status}
                        </span>
                        <div className="flex space-x-2">
                          <button className="button-secondary text-sm">Configure</button>
                          <button
                            onClick={() => handleViewDetails(agent.id)}
                            className="button-primary text-sm"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          )}
        </div>
      </div>

      {showDeployModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-2xl max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-white">Deploy New Agent</h2>
                <button
                  onClick={() => setShowDeployModal(false)}
                  className="text-white/50 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Choose a Template</h3>
                <div className="space-y-4">
                  {deploymentTemplates.map(template => (
                    <div
                      key={template.id}
                      className="p-4 rounded-lg border border-white/10 hover:border-accent/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-white font-medium">{template.name}</h4>
                          <p className="text-white/50 text-sm mt-1">{template.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          {template.platforms.map(platform => {
                            const PlatformIcon =
                              platformFilters.find(f => f.id === platform)?.icon || GlobeAltIcon;
                            return (
                              <div key={platform} className="flex items-center space-x-1">
                                <PlatformIcon className="w-5 h-5 text-white/50" />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button onClick={() => setShowDeployModal(false)} className="button-secondary">
                  Cancel
                </button>
                <button className="button-primary flex items-center">
                  <RocketLaunchIcon className="w-5 h-5 mr-2" />
                  Deploy Agent
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
