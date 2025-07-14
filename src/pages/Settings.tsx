/**
 * Copyright (c) 2025 Preamble, Inc.
 * All rights reserved.
 * 
 * This file is part of the Prompt Injector AI security testing platform.
 * Unauthorized copying or distribution of this file is prohibited.
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { aiAPIIntegration } from '../services/ai-api-integration';
import { addModel, updateModel, deleteModel, loadModels } from '../services/model-manager';
import { AIModel } from '../types';
// TODO: Replace with actual vendor logo imports or static paths
const vendorLogos: Record<string, string> = {
  ollama: '/assets/images/preamble_logotype.png',
  openai: '/assets/images/preamble_logotype.png',
  anthropic: '/assets/images/preamble_logotype.png',
  google: '/assets/images/preamble_logotype.png',
  grok: '/assets/images/preamble_logotype.png',
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

import Modal from '../components/Modal';

const PROVIDERS = [
  { id: 'ollama', name: 'Ollama' },
  { id: 'openai', name: 'OpenAI' },
  { id: 'anthropic', name: 'Anthropic' },
  { id: 'google', name: 'Google Gemini' },
  { id: 'grok', name: 'Grok (xAI)' },
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

  useEffect(() => {
    loadAllModels();
  }, []);

  const loadAllModels = async () => {
    const loaded = await loadModels();
    setModels(loaded);
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
      const models = await aiAPIIntegration.getAvailableModels(providerId, apiKey);
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
    if (['openai', 'anthropic', 'google', 'grok'].includes(modalProvider) && !modalApiKey) {
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
      await addModel({
        name: modelLists[modalProvider]?.find(m => m.id === modalModel)?.name || modalModel,
        provider: PROVIDERS.find(p => p.id === modalProvider)?.name || modalProvider,
        endpoint: '',
        model: modalModel,
        enabled: true,
        apiKey: modalApiKey,
      });
    } else if (modalMode === 'edit' && editId) {
      await updateModel(editId, {
        model: modalModel,
        apiKey: modalApiKey,
        enabled: true,
      });
    }
    setModalOpen(false);
    await loadAllModels();
  };

  const handleRemove = async (id: string) => {
    await deleteModel(id);
    await loadAllModels();
  };

  const enabledModels = models.filter(m => m.enabled);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Model Providers</h1>
      <button
        className="mb-6 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg"
        onClick={openAddModal}
      >
        + Add Model
      </button>
      {enabledModels.length === 0 ? (
        <div className="bg-gray-900 text-white rounded-xl shadow p-8 flex flex-col items-center justify-center border border-gray-800">
          <p className="text-lg mb-4">No models configured yet.</p>
          <button
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            onClick={openAddModal}
          >
            Add your first model
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {enabledModels.map((model) => (
            <div key={model.id} className="bg-gray-900 text-white rounded-xl shadow p-6 flex flex-col md:flex-row items-center gap-6 border border-gray-800">
              <div className="flex-1 w-full">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{model.provider}</h2>
                  <span className="text-gray-400 text-sm ml-2">{model.model}</span>
                </div>
                <div className="mt-2 flex items-center gap-4">
                  <span className={`inline-block w-3 h-3 rounded-full bg-green-500`} title={'Connected'}></span>
                  <button
                    className="px-4 py-2 rounded bg-blue-700 text-white font-semibold hover:bg-blue-800 transition"
                    onClick={() => openEditModal(model)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-red-700 text-white font-semibold hover:bg-red-800 transition"
                    onClick={() => handleRemove(model.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={modalOpen} onClose={closeModal} title={modalMode === 'add' ? 'Add Model' : 'Edit Model'}>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Provider</label>
            <select
              className="w-full px-3 py-2 rounded border border-gray-700 bg-gray-800 text-white"
              value={modalProvider}
              onChange={handleProviderChange}
              disabled={modalMode === 'edit'}
              required
            >
              <option value="">Select a provider</option>
              {PROVIDERS.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          {['openai', 'anthropic', 'google', 'grok'].includes(modalProvider) && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">API Key</label>
              <input
                type="password"
                className="w-full px-3 py-2 rounded border border-gray-700 bg-gray-800 text-white"
                value={modalApiKey}
                onChange={handleApiKeyChange}
                required
              />
            </div>
          )}
          <div className="mb-4 flex items-center gap-4">
            <button
              type="button"
              className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              onClick={handleTestConnection}
              disabled={loading[modalProvider]}
            >
              {loading[modalProvider] ? 'Testing...' : 'Test Connection'}
            </button>
            {modalError && <span className="text-red-400 text-sm">{modalError}</span>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Model</label>
            <select
              className="w-full px-3 py-2 rounded border border-gray-700 bg-gray-800 text-white"
              value={modalModel}
              onChange={handleModelSelect}
              disabled={!modelLists[modalProvider] || !modelLists[modalProvider].length}
              required
            >
              <option value="">{modelLists[modalProvider]?.length ? 'Select a model' : 'No models available'}</option>
              {modelLists[modalProvider]?.map((m) => (
                <option key={m.id} value={m.id}>{m.name || m.id}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 rounded bg-blue-700 text-white font-semibold hover:bg-blue-800 transition"
              disabled={!modalProvider || !modalModel || loading[modalProvider]}
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Settings; 