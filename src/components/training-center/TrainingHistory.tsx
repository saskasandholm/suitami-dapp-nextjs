import { useState } from 'react';
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
  ClockIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface TrainingHistoryProps {
  agentId: string;
}

interface TrainingSession {
  id: string;
  startTime: string;
  endTime: string;
  status: 'completed' | 'failed' | 'interrupted';
  metrics: {
    finalAccuracy: number;
    finalLoss: number;
    trainingTime: string;
    epochsCompleted: number;
  };
  config: {
    learningRate: number;
    batchSize: number;
    epochs: number;
    optimizer: string;
  };
  logs: TrainingLog[];
}

interface TrainingLog {
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
}

// Mock data - in a real app, this would come from an API
const mockTrainingSessions: TrainingSession[] = [
  {
    id: '1',
    startTime: '2024-02-14 10:30:00',
    endTime: '2024-02-14 11:45:00',
    status: 'completed',
    metrics: {
      finalAccuracy: 0.92,
      finalLoss: 0.08,
      trainingTime: '1h 15m',
      epochsCompleted: 100,
    },
    config: {
      learningRate: 0.001,
      batchSize: 32,
      epochs: 100,
      optimizer: 'Adam',
    },
    logs: [
      {
        timestamp: '10:30:00',
        level: 'info',
        message: 'Training started with batch size 32',
      },
      {
        timestamp: '11:00:00',
        level: 'info',
        message: 'Epoch 50/100 - Accuracy: 0.85, Loss: 0.15',
      },
      {
        timestamp: '11:45:00',
        level: 'info',
        message: 'Training completed successfully',
      },
    ],
  },
  {
    id: '2',
    startTime: '2024-02-13 15:00:00',
    endTime: '2024-02-13 15:30:00',
    status: 'failed',
    metrics: {
      finalAccuracy: 0.45,
      finalLoss: 2.3,
      trainingTime: '30m',
      epochsCompleted: 25,
    },
    config: {
      learningRate: 0.01,
      batchSize: 64,
      epochs: 100,
      optimizer: 'SGD',
    },
    logs: [
      {
        timestamp: '15:00:00',
        level: 'info',
        message: 'Training started with batch size 64',
      },
      {
        timestamp: '15:15:00',
        level: 'warning',
        message: 'Loss increasing - potential learning rate issue',
      },
      {
        timestamp: '15:30:00',
        level: 'error',
        message: 'Training failed due to exploding gradients',
      },
    ],
  },
];

export default function TrainingHistory({ agentId }: TrainingHistoryProps) {
  const [sessions] = useState<TrainingSession[]>(mockTrainingSessions);

  return (
    <Card className="glass-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-lg bg-[#87fafd]/10 flex items-center justify-center mr-4">
            <ClockIcon className="w-6 h-6 text-accent" />
          </div>
          <div>
            <Title className="text-white">Training History</Title>
            <Text className="text-white/70">Past training sessions and their results</Text>
          </div>
        </div>
      </div>

      <TabGroup>
        <TabList className="border-b border-white/10">
          <Tab className="text-white/70 hover:text-accent">
            <ChartBarIcon className="w-5 h-5 mr-2 inline-block" />
            Sessions
          </Tab>
          <Tab className="text-white/70 hover:text-accent">
            <DocumentTextIcon className="w-5 h-5 mr-2 inline-block" />
            Logs
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <div className="space-y-4 mt-4">
              {sessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {session.status === 'completed' ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-400" />
                      ) : session.status === 'failed' ? (
                        <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                      ) : (
                        <ClockIcon className="w-5 h-5 text-yellow-400" />
                      )}
                      <div>
                        <Text className="text-white font-medium">
                          Training Session {session.id}
                        </Text>
                        <Text className="text-white/50 text-sm">{session.startTime}</Text>
                      </div>
                    </div>
                    <Badge
                      className={`${
                        session.status === 'completed'
                          ? 'bg-green-400/10 text-green-400'
                          : session.status === 'failed'
                            ? 'bg-red-400/10 text-red-400'
                            : 'bg-yellow-400/10 text-yellow-400'
                      }`}
                    >
                      {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="glass-card p-3">
                      <Text className="text-white/70 text-sm">Accuracy</Text>
                      <Text className="text-white text-lg">
                        {(session.metrics.finalAccuracy * 100).toFixed(1)}%
                      </Text>
                    </div>
                    <div className="glass-card p-3">
                      <Text className="text-white/70 text-sm">Loss</Text>
                      <Text className="text-white text-lg">
                        {session.metrics.finalLoss.toFixed(3)}
                      </Text>
                    </div>
                    <div className="glass-card p-3">
                      <Text className="text-white/70 text-sm">Duration</Text>
                      <Text className="text-white text-lg">{session.metrics.trainingTime}</Text>
                    </div>
                    <div className="glass-card p-3">
                      <Text className="text-white/70 text-sm">Epochs</Text>
                      <Text className="text-white text-lg">{session.metrics.epochsCompleted}</Text>
                    </div>
                  </div>

                  <div className="text-white/70 text-sm">
                    <span className="mr-4">LR: {session.config.learningRate}</span>
                    <span className="mr-4">Batch: {session.config.batchSize}</span>
                    <span>Optimizer: {session.config.optimizer}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabPanel>

          <TabPanel>
            <div className="space-y-4 mt-4">
              {sessions.flatMap(session =>
                session.logs.map((log, index) => (
                  <motion.div
                    key={`${session.id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-3 glass-card"
                  >
                    <div className="flex-shrink-0">
                      {log.level === 'info' && (
                        <div className="w-2 h-2 mt-2 rounded-full bg-accent" />
                      )}
                      {log.level === 'warning' && (
                        <div className="w-2 h-2 mt-2 rounded-full bg-yellow-400" />
                      )}
                      {log.level === 'error' && (
                        <div className="w-2 h-2 mt-2 rounded-full bg-red-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Text className="text-white font-medium">Session {session.id}</Text>
                        <Text className="text-white/50 text-sm">{log.timestamp}</Text>
                      </div>
                      <Text
                        className={`text-sm ${
                          log.level === 'error'
                            ? 'text-red-400'
                            : log.level === 'warning'
                              ? 'text-yellow-400'
                              : 'text-white/70'
                        }`}
                      >
                        {log.message}
                      </Text>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Card>
  );
}
