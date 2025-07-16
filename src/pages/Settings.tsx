/**
 * Copyright (c) 2025 Preamble, Inc.
 * All rights reserved.
 * 
 * This file is part of the Prompt Injector AI security testing platform.
 * Unauthorized copying or distribution of this file is prohibited.
 */

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Plus, 
  Edit2, 
  Trash2, 
  Settings as SettingsIcon,
  Zap,
  Shield,
  Globe,
  Key,
  Brain,
  AlertCircle,
  Check,
  X,
  ChevronRight,
  Star,
  Sparkles
} from 'lucide-react';
import { addModel, updateModel, deleteModel, loadModels, setDefaultPayloadModel, getDefaultPayloadModel, cleanupDuplicateModels } from '../services/model-manager';
import { AIModel } from '../types';
import { activityLogger } from '../services/activity-logger';
import Modal from '../components/Modal';

// TODO: Replace with actual vendor logo imports or static paths
const vendorLogos: Record<string, string> = {
  ollama: '/assets/images/preamble_logotype.png',
  openai: '/assets/images/preamble_logotype.png',
  anthropic: '/assets/images/preamble_logotype.png',
  google: '/assets/images/preamble_logotype.png',
  xai: '/assets/images/preamble_logotype.png',
};

interface VendorConfig {
  enabled?: boolean;
  apiKey?: string;
  model?: string;
}

interface ModelOption {
  id: string;
  name?: string;
}

type StatusType = 'success' | 'error' | undefined;

const PROVIDERS = [
  { id: 'ollama', name: 'Ollama', icon: Brain, description: 'Local AI models' },
  { id: 'openai', name: 'OpenAI', icon: Zap, description: 'GPT models' },
  { id: 'anthropic', name: 'Anthropic', icon: Shield, description: 'Claude models' },
  { id: 'google', name: 'Google Gemini', icon: Globe, description: 'Gemini models' },
  { id: 'xai', name: 'xAI Grok', icon: Sparkles, description: 'Grok models' },
];

const Settings = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [modelLists, setModelLists] = useState<Record<string, ModelOption[]>>({});
  const [status, setStatus] = useState<Record<string, StatusType>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [modalProvider, setModalProvider] = useState<string>('');
  const [modalApiKey, setModalApiKey] = useState<string>('');
  const [modalModel, setModalModel] = useState<string>('');
  const [modalError, setModalError] = useState<string>('');
  const [editId, setEditId] = useState<string | null>(null);
  const [defaultPayloadModelId, setDefaultPayloadModelId] = useState<string | null>(null);

  useEffect(() => {
    loadAllModels();
    loadDefaultPayloadModel();
  }, []);

  const loadAllModels = async () => {
    // Clean up any existing duplicates first
    await cleanupDuplicateModels();
    const loaded = await loadModels();
    setModels(loaded);
  };

  const loadDefaultPayloadModel = async () => {
    const model = await getDefaultPayloadModel();
    setDefaultPayloadModelId(model ? model.id : null);
  };

  const handleSetDefaultPayloadModel = async (id: string) => {
    await setDefaultPayloadModel(id);
    setDefaultPayloadModelId(id);
  };

  const openAddModal = () => {
    setModalMode('add');
    setModalProvider('');
    setModalApiKey('');
    setModalModel('');
    setModalError('');
    setEditId(null);
    setModalOpen(true);
  };

  const openEditModal = (model: AIModel) => {
    setModalMode('edit');
    setModalProvider(model.provider.toLowerCase());
    setModalApiKey(model.apiKey || '');
    setModalModel(model.model);
    setModalError('');
    setEditId(model.id);
    setModalOpen(true);
    if (model.apiKey) {
      fetchModels(model.provider.toLowerCase(), model.apiKey);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalError('');
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModalProvider(e.target.value);
    setModalApiKey('');
    setModalModel('');
    setModalError('');
    setModelLists((ml) => ({ ...ml, [e.target.value]: [] }));
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModalApiKey(e.target.value);
    setModalModel('');
    setModalError('');
  };

  const fetchModels = async (providerId: string, apiKey: string) => {
    setLoading((l) => ({ ...l, [providerId]: true }));
    setModalError('');
    try {
      const aiModels = await window.electronAPI.getAvailableModels(providerId, apiKey);
      const models: ModelOption[] = aiModels.map((model: any) => ({
        id: model.id,
        name: model.name,
        provider: providerId
      }));
      setModelLists((ml) => ({ ...ml, [providerId]: models }));
      if (!models.length) setModalError('No models found for this provider.');
    } catch (e) {
      setModalError('Failed to fetch models. Please check your API key or provider status.');
    } finally {
      setLoading((l) => ({ ...l, [providerId]: false }));
    }
  };

  const handleTestConnection = async () => {
    if (!modalProvider) return setModalError('Please select a provider.');
    if (['openai', 'anthropic', 'google', 'xai'].includes(modalProvider) && !modalApiKey) {
      return setModalError('API key is required for this provider.');
    }
    await fetchModels(modalProvider, modalApiKey);
  };

  const handleModelSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModalModel(e.target.value);
  };

  const handleSave = async () => {
    if (!modalProvider || !modalModel) {
      setModalError('Provider and model are required.');
      return;
    }
    if (modalMode === 'add') {
      // Generate a more robust unique ID by sanitizing the model name
      const sanitizedModel = modalModel.replace(/[^a-zA-Z0-9-_.]/g, '-');
      const modelId = `${modalProvider}-${sanitizedModel}`;
      const modelName = modelLists[modalProvider]?.find(m => m.id === modalModel)?.name || modalModel;
      
      await addModel({
        id: modelId,
        name: modelName,
        provider: modalProvider, // always use canonical provider id
        endpoint: '',
        model: modalModel,
        enabled: true,
        apiKey: modalApiKey,
      });
      
      // Log activity
      activityLogger.logModelConfiguration(modelName, modalProvider, true);
    } else if (modalMode === 'edit' && editId) {
      const modelName = modelLists[modalProvider]?.find(m => m.id === modalModel)?.name || modalModel;
      
      await updateModel(editId, {
        model: modalModel,
        apiKey: modalApiKey,
        enabled: true,
        provider: modalProvider, // always use canonical provider id
      });
      
      // Log activity
      activityLogger.logModelConfiguration(modelName, modalProvider, true);
    }
    setModalOpen(false);
    await loadAllModels();
  };

  const handleRemove = async (id: string) => {
    // Get model info before deletion for logging
    const modelToDelete = models.find(m => m.id === id);
    await deleteModel(id);
    
    // Log activity
    if (modelToDelete) {
      activityLogger.logModelConfiguration(modelToDelete.name, modelToDelete.provider, false);
    }
    
    await loadAllModels();
  };

  const getProviderInfo = (providerId: string) => {
    return PROVIDERS.find(p => p.id === providerId.toLowerCase()) || PROVIDERS[0];
  };

  const enabledModels = models.filter(m => m.enabled);

  return (
    <div className="page-container">
      {/* Compact Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-[#4556E4] to-[#1F2C6D] rounded-lg">
            <SettingsIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#081423]">Model Configuration</h1>
            <p className="text-sm text-[#1F2C6D]/70">Configure AI model providers and set your default payload model</p>
          </div>
        </div>
        <button
          className="btn-primary flex items-center space-x-2"
          onClick={openAddModal}
        >
          <Plus className="h-4 w-4" />
          <span>Add Model</span>
        </button>
      </div>

      {/* Models List */}
      {enabledModels.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-20 h-20 bg-[#4556E4]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="h-10 w-10 text-[#4556E4]" />
          </div>
          <h3 className="text-xl font-semibold text-[#081423] mb-2">No Models Configured</h3>
          <p className="text-[#1F2C6D]/70 mb-6 max-w-md mx-auto">
            Add your first AI model provider to start security testing. The first model you add will automatically become your default payload model.
          </p>
          <button
            className="btn-primary"
            onClick={openAddModal}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Your First Model
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header for the models list */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold text-[#081423]">Configured Models</h2>
              <span className="px-2 py-1 text-xs bg-[#4556E4]/10 text-[#4556E4] rounded-full">
                {enabledModels.length} model{enabledModels.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-[#1F2C6D]/70">
              <Star className="h-4 w-4 text-[#FFC700]" />
              <span>Click star to set as default payload creation model</span>
            </div>
          </div>

          {/* Models grid */}
          <div className="grid gap-4">
            {enabledModels.map((model) => {
              const providerInfo = getProviderInfo(model.provider);
              const isDefault = defaultPayloadModelId === model.id;
              return (
                <div key={model.id} className="card-hover p-5 transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-[#4556E4]/10 rounded-lg">
                        <providerInfo.icon className="h-6 w-6 text-[#4556E4]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-[#081423]">{providerInfo.name}</h3>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-green-600 font-medium">Active</span>
                            </div>
                            {isDefault && (
                              <span className="px-2 py-1 text-xs bg-[#FFC700] text-[#081423] rounded-full font-medium">
                                Default Payload Model
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-1">
                          <div className="text-sm text-[#1F2C6D]">{model.model}</div>
                          <div className="text-xs text-[#1F2C6D]/60">{providerInfo.description}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className={`p-2 rounded-lg transition-all ${
                          isDefault 
                            ? 'text-[#FFC700] bg-[#FFC700]/10' 
                            : 'text-gray-400 hover:text-[#FFC700] hover:bg-[#FFC700]/10'
                        }`}
                        onClick={() => handleSetDefaultPayloadModel(model.id)}
                        title={isDefault ? 'Default payload model' : 'Set as default payload model'}
                      >
                        <Star className={`h-5 w-5 ${isDefault ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        className="p-2 text-[#4556E4] hover:bg-[#4556E4]/10 rounded-lg transition-colors"
                        onClick={() => openEditModal(model)}
                        title="Edit model"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => handleRemove(model.id)}
                        title="Remove model"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Compact Modal */}
      <Modal 
        isOpen={modalOpen} 
        onClose={closeModal} 
        title={
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-[#4556E4]/10 rounded">
              {modalMode === 'add' ? <Plus className="h-4 w-4 text-[#4556E4]" /> : <Edit2 className="h-4 w-4 text-[#4556E4]" />}
            </div>
            <span>{modalMode === 'add' ? 'Add Model Provider' : 'Edit Model Provider'}</span>
          </div>
        }
      >
        <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-4">
          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-medium text-[#081423] mb-1">Provider</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4556E4] focus:border-[#4556E4]"
              value={modalProvider}
              onChange={handleProviderChange}
              disabled={modalMode === 'edit'}
              required
            >
              <option value="">Select provider</option>
              {PROVIDERS.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>

          {/* API Key Input */}
          {['openai', 'anthropic', 'google', 'xai'].includes(modalProvider) && (
            <div>
              <label className="block text-sm font-medium text-[#081423] mb-1">API Key</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#1F2C6D]/50" />
                <input
                  type="password"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4556E4] focus:border-[#4556E4]"
                  value={modalApiKey}
                  onChange={handleApiKeyChange}
                  placeholder="Enter API key"
                  required
                />
              </div>
            </div>
          )}

          {/* Test Connection & Model Selection */}
          <div className="flex space-x-3">
            <button
              type="button"
              className="btn-secondary flex items-center space-x-2"
              onClick={handleTestConnection}
              disabled={loading[modalProvider]}
            >
              {loading[modalProvider] ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              <span>Test</span>
            </button>
            <div className="flex-1">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4556E4] focus:border-[#4556E4]"
                value={modalModel}
                onChange={handleModelSelect}
                disabled={!modelLists[modalProvider] || !modelLists[modalProvider].length}
                required
              >
                <option value="">
                  {modelLists[modalProvider]?.length ? 'Select model' : 'Test connection first'}
                </option>
                {modelLists[modalProvider]?.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name || model.id}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {modalError && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">{modalError}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              className="btn-secondary"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2"
              disabled={!modalProvider || !modalModel || loading[modalProvider]}
            >
              <Check className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Settings; 