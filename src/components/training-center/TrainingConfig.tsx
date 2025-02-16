import { useState } from 'react';
import { Card, Title, Text, Badge } from '@tremor/react';
import { motion } from 'framer-motion';
import {
  AdjustmentsHorizontalIcon,
  BeakerIcon,
  DocumentIcon,
  LightBulbIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';

interface TrainingConfigProps {
  agentId: string;
  onConfigUpdate: (config: TrainingConfiguration) => void;
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

const defaultConfig: TrainingConfiguration = {
  learningRate: 0.001,
  batchSize: 32,
  epochs: 100,
  optimizer: 'Adam',
  lossFunction: 'CrossEntropy',
  modelArchitecture: 'Transformer',
  datasetSize: 10000,
  validationSplit: 0.2,
};

export default function TrainingConfig({ agentId, onConfigUpdate }: TrainingConfigProps) {
  const [config, setConfig] = useState<TrainingConfiguration>(defaultConfig);
  const [activeSection, setActiveSection] = useState<string>('basic');

  const handleConfigChange = (key: keyof TrainingConfiguration, value: TrainingConfiguration[keyof TrainingConfiguration]) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onConfigUpdate(newConfig);
  };

  return (
    <Card className="glass-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-lg bg-[#87fafd]/10 flex items-center justify-center mr-4">
            <AdjustmentsHorizontalIcon className="w-6 h-6 text-accent" />
          </div>
          <div>
            <Title className="text-white">Training Configuration</Title>
            <Text className="text-white/70">Customize your model&apos;s training parameters</Text>
          </div>
        </div>
        <Badge className="bg-accent/10 text-accent">Advanced Settings</Badge>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveSection('basic')}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            activeSection === 'basic'
              ? 'bg-accent text-black'
              : 'bg-white/5 text-white/70 hover:bg-white/10'
          }`}
        >
          <BeakerIcon className="w-5 h-5 mr-2" />
          Basic
        </button>
        <button
          onClick={() => setActiveSection('advanced')}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            activeSection === 'advanced'
              ? 'bg-accent text-black'
              : 'bg-white/5 text-white/70 hover:bg-white/10'
          }`}
        >
          <CpuChipIcon className="w-5 h-5 mr-2" />
          Advanced
        </button>
        <button
          onClick={() => setActiveSection('data')}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            activeSection === 'data'
              ? 'bg-accent text-black'
              : 'bg-white/5 text-white/70 hover:bg-white/10'
          }`}
        >
          <DocumentIcon className="w-5 h-5 mr-2" />
          Data
        </button>
      </div>

      {activeSection === 'basic' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-white/70 text-sm">Learning Rate</label>
              <input
                type="number"
                value={config.learningRate}
                onChange={e => handleConfigChange('learningRate', parseFloat(e.target.value))}
                step="0.0001"
                min="0.0001"
                max="0.1"
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-white/70 text-sm">Batch Size</label>
              <input
                type="number"
                value={config.batchSize}
                onChange={e => handleConfigChange('batchSize', parseInt(e.target.value))}
                min="1"
                max="512"
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-white/70 text-sm">Epochs</label>
              <input
                type="number"
                value={config.epochs}
                onChange={e => handleConfigChange('epochs', parseInt(e.target.value))}
                min="1"
                max="1000"
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-white/70 text-sm">Optimizer</label>
              <select
                value={config.optimizer}
                onChange={e => handleConfigChange('optimizer', e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none"
              >
                <option value="Adam">Adam</option>
                <option value="SGD">SGD</option>
                <option value="RMSprop">RMSprop</option>
                <option value="Adagrad">Adagrad</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {activeSection === 'advanced' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-white/70 text-sm">Loss Function</label>
              <select
                value={config.lossFunction}
                onChange={e => handleConfigChange('lossFunction', e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none"
              >
                <option value="CrossEntropy">Cross Entropy</option>
                <option value="MSE">Mean Squared Error</option>
                <option value="MAE">Mean Absolute Error</option>
                <option value="Huber">Huber Loss</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-white/70 text-sm">Model Architecture</label>
              <select
                value={config.modelArchitecture}
                onChange={e => handleConfigChange('modelArchitecture', e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none"
              >
                <option value="Transformer">Transformer</option>
                <option value="LSTM">LSTM</option>
                <option value="GRU">GRU</option>
                <option value="CNN">CNN</option>
              </select>
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center space-x-2 mb-4">
              <LightBulbIcon className="w-5 h-5 text-accent" />
              <Text className="text-white">Recommended Settings</Text>
            </div>
            <div className="text-white/70 text-sm space-y-2">
              <p>• Use Adam optimizer with learning rate 0.001 for stable training</p>
              <p>• Batch size of 32-64 provides good balance of speed and stability</p>
              <p>• Cross Entropy loss is recommended for classification tasks</p>
              <p>• Transformer architecture works well for language tasks</p>
            </div>
          </div>
        </motion.div>
      )}

      {activeSection === 'data' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-white/70 text-sm">Dataset Size</label>
              <input
                type="number"
                value={config.datasetSize}
                onChange={e => handleConfigChange('datasetSize', parseInt(e.target.value))}
                min="100"
                max="1000000"
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-white/70 text-sm">Validation Split</label>
              <input
                type="number"
                value={config.validationSplit}
                onChange={e => handleConfigChange('validationSplit', parseFloat(e.target.value))}
                step="0.05"
                min="0.1"
                max="0.4"
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none"
              />
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center space-x-2 mb-4">
              <DocumentIcon className="w-5 h-5 text-accent" />
              <Text className="text-white">Dataset Information</Text>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-3">
                <Text className="text-white/70 text-sm">Training Samples</Text>
                <Text className="text-white text-lg">
                  {Math.round(config.datasetSize * (1 - config.validationSplit)).toLocaleString()}
                </Text>
              </div>
              <div className="glass-card p-3">
                <Text className="text-white/70 text-sm">Validation Samples</Text>
                <Text className="text-white text-lg">
                  {Math.round(config.datasetSize * config.validationSplit).toLocaleString()}
                </Text>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </Card>
  );
}
