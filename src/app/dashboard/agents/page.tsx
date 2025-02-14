'use client';

import { useState } from 'react';
import { Card, Title, Text, Tab, TabList, TabGroup, TabPanel, TabPanels } from "@tremor/react";
import { motion } from "framer-motion";
import {
  Cog6ToothIcon,
  DocumentTextIcon,
  BeakerIcon,
  ChatBubbleLeftRightIcon,
  CommandLineIcon,
} from "@heroicons/react/24/outline";
import AgentSettings from "@/components/agents/AgentSettings";
import KnowledgeBase from "@/components/knowledge-base/KnowledgeBase";

interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  platform: string;
  avatar?: string;
}

const initialTemplates: AgentTemplate[] = [
  {
    id: '1',
    name: 'Community Manager',
    description: 'Manages community interactions and moderates content',
    type: 'Management',
    platform: 'Discord',
  },
  {
    id: '2',
    name: 'Support Agent',
    description: 'Handles user inquiries and technical support',
    type: 'Support',
    platform: 'Telegram',
  },
  {
    id: '3',
    name: 'Content Curator',
    description: 'Curates and shares relevant content',
    type: 'Curation',
    platform: 'X (Twitter)',
  },
];

export default function AgentsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null);
  const [activeTab, setActiveTab] = useState('configuration');

  const handleAgentUpdate = (data: { name: string; avatar?: File }) => {
    if (selectedTemplate) {
      setSelectedTemplate({
        ...selectedTemplate,
        name: data.name,
        avatar: data.avatar ? URL.createObjectURL(data.avatar) : selectedTemplate.avatar,
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Agent Management</h1>
          <p className="text-white/70 mt-1">Configure and train your AI agents</p>
        </div>
      </div>

      {/* Agent Templates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {initialTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`glass-card hover-accent cursor-pointer ${
                selectedTemplate?.id === template.id ? 'border-accent' : ''
              }`}
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-[#87fafd]/10 flex items-center justify-center mr-4 overflow-hidden">
                  {template.avatar ? (
                    <img 
                      src={template.avatar} 
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <CommandLineIcon className="w-6 h-6 text-accent" />
                  )}
                </div>
                <div>
                  <Title className="text-white">{template.name}</Title>
                  <Text className="text-white/70">{template.type}</Text>
                </div>
              </div>
              <Text className="text-white/70 mb-4">{template.description}</Text>
              <Text className="text-white/70">Platform: {template.platform}</Text>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Agent Configuration Tabs */}
      {selectedTemplate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card">
            <Title className="text-white mb-6">Configure {selectedTemplate.name}</Title>
            <TabGroup>
              <TabList className="border-b border-white/10">
                <Tab 
                  className="text-white/70 hover:text-accent"
                  onClick={() => setActiveTab('configuration')}
                >
                  <Cog6ToothIcon className="w-5 h-5 mr-2 inline-block" />
                  Configuration
                </Tab>
                <Tab 
                  className="text-white/70 hover:text-accent"
                  onClick={() => setActiveTab('knowledge')}
                >
                  <DocumentTextIcon className="w-5 h-5 mr-2 inline-block" />
                  Agent Knowledge Base
                </Tab>
                <Tab 
                  className="text-white/70 hover:text-accent"
                  onClick={() => setActiveTab('training')}
                >
                  <BeakerIcon className="w-5 h-5 mr-2 inline-block" />
                  Training Data
                </Tab>
                <Tab 
                  className="text-white/70 hover:text-accent"
                  onClick={() => setActiveTab('responses')}
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2 inline-block" />
                  Responses
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <div className="mt-6">
                    <AgentSettings
                      agentId={selectedTemplate.id}
                      initialName={selectedTemplate.name}
                      initialAvatar={selectedTemplate.avatar}
                      onUpdate={handleAgentUpdate}
                    />
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="mt-6">
                    <Card className="glass-card">
                      <Title className="text-white mb-4">{selectedTemplate.name} Knowledge Base</Title>
                      <KnowledgeBase agentId={selectedTemplate.id} />
                    </Card>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="mt-6">
                    <Card className="glass-card">
                      <Title className="text-white mb-4">Training Examples</Title>
                      <Text className="text-white/70">
                        Add specific training examples and scenarios for {selectedTemplate.name}
                      </Text>
                      {/* Training data component will go here */}
                    </Card>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="mt-6">
                    <Card className="glass-card">
                      <Title className="text-white mb-4">Response Templates</Title>
                      <Text className="text-white/70">
                        Configure how {selectedTemplate.name} responds to different scenarios
                      </Text>
                      {/* Response templates component will go here */}
                    </Card>
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </Card>
        </motion.div>
      )}
    </div>
  );
} 