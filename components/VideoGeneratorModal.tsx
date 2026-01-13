import React, { useState, useEffect } from 'react';
import Button from './Button';
import { generateVideo } from '../services/geminiService';
import { Film, X, Loader2, Upload, Lock } from 'lucide-react';

interface Props {
  currentImage: string;
  onClose: () => void;
}

const VideoGeneratorModal: React.FC<Props> = ({ currentImage, onClose }) => {
  const [hasKey, setHasKey] = useState(true);
  const [prompt, setPrompt] = useState('Cinematic shot, dynamic lighting, subtle movement');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('9:16');
  const [selectedImage, setSelectedImage] = useState<string>(currentImage);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const checkKey = async () => {
      if ((window as any).aistudio && (window as any).aistudio.hasSelectedApiKey) {
        const has = await (window as any).aistudio.hasSelectedApiKey();
        setHasKey(has);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if ((window as any).aistudio && (window as any).aistudio.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      // Assume success after interaction to prevent race condition loop
      setHasKey(true);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!hasKey) {
        await handleSelectKey();
        return;
    }

    setLoading(true);
    setVideoUrl(null);
    setStatusMessage('凝聚查克拉中... (初始化)');

    // Rotate messages to reassure user during long generation
    const messages = [
        '正在结印... (Veo 模型加载中)',
        '注入风属性查克拉... (生成视频帧)',
        '施展幻术·活动绘卷... (渲染中)',
        '即将完成... (最终处理)',
    ];
    let msgIdx = 0;
    const interval = setInterval(() => {
        msgIdx = (msgIdx + 1) % messages.length;
        setStatusMessage(messages[msgIdx]);
    }, 5000);

    try {
      const url = await generateVideo(selectedImage, prompt, aspectRatio);
      setVideoUrl(url);
    } catch (e) {
      setStatusMessage('忍术失败：无法生成视频。请检查 API Key 或重试。');
      console.error(e);
      // If error suggests auth issue, reset key state
      if ((e as Error).message.includes('403') || (e as Error).message.includes('401')) {
          setHasKey(false);
      }
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  if (!hasKey) {
    return (
      <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
         <div className="bg-gray-900 border-2 border-red-500 rounded-2xl p-8 max-w-md text-center space-y-6 shadow-2xl">
            <Lock className="w-16 h-16 text-red-500 mx-auto animate-pulse" />
            <h2 className="text-2xl font-comic text-white">需要付费 API Key</h2>
            <p className="text-gray-400">使用 Veo 视频生成模型需要付费项目的 API Key。</p>
            <div className="text-sm text-gray-500 bg-gray-800 p-2 rounded">
               <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-white">查看计费文档</a>
            </div>
            <Button onClick={handleSelectKey} fullWidth variant="danger">
               解锁查克拉限制
            </Button>
            <button onClick={onClose} className="text-gray-500 hover:text-white underline text-sm">取消</button>
         </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-900 border-2 border-cyan-500 rounded-2xl p-6 flex flex-col space-y-4 shadow-[0_0_50px_rgba(6,182,212,0.3)] max-h-[90vh] overflow-y-auto">
        
        <div className="flex justify-between items-center border-b border-gray-800 pb-2">
          <h2 className="text-2xl font-comic text-cyan-400 flex items-center gap-2">
            <Film /> 秘传·动态绘卷 (Veo)
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Side */}
            <div className="space-y-4">
                <div className="relative group w-full aspect-[9/16] md:aspect-square bg-black/50 rounded-lg overflow-hidden border border-gray-700 flex items-center justify-center">
                    <img 
                        src={selectedImage} 
                        alt="Source" 
                        className="w-full h-full object-contain"
                    />
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white font-bold">
                        <Upload size={32} className="mb-2"/>
                        <span>更换图片</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">提示词 (Prompt)</label>
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none h-20 resize-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-400">比例</label>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setAspectRatio('9:16')}
                            className={`flex-1 py-2 rounded border ${aspectRatio === '9:16' ? 'bg-cyan-900/50 border-cyan-500 text-cyan-200' : 'bg-gray-800 border-gray-600 text-gray-400'}`}
                        >
                            9:16 (竖屏)
                        </button>
                        <button 
                            onClick={() => setAspectRatio('16:9')}
                            className={`flex-1 py-2 rounded border ${aspectRatio === '16:9' ? 'bg-cyan-900/50 border-cyan-500 text-cyan-200' : 'bg-gray-800 border-gray-600 text-gray-400'}`}
                        >
                            16:9 (横屏)
                        </button>
                    </div>
                </div>

                <Button 
                    onClick={handleGenerate} 
                    disabled={loading} 
                    fullWidth 
                    className="bg-cyan-700 border-cyan-500 hover:bg-cyan-600"
                >
                    {loading ? <Loader2 className="animate-spin inline mr-2"/> : <Film className="inline mr-2"/>}
                    {loading ? '生成中...' : '生成视频'}
                </Button>
            </div>

            {/* Output Side */}
            <div className="flex flex-col items-center justify-center bg-black/50 rounded-lg border border-gray-800 min-h-[300px] p-4 relative">
                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 text-center p-4">
                        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-cyan-300 animate-pulse">{statusMessage}</p>
                        <p className="text-gray-500 text-xs mt-4">Veo 生成视频通常需要 1-2 分钟，请耐心等待...</p>
                    </div>
                )}
                
                {videoUrl ? (
                    <video 
                        src={videoUrl} 
                        controls 
                        autoPlay 
                        loop 
                        className="w-full h-full object-contain rounded shadow-lg shadow-cyan-900/50"
                    />
                ) : (
                    <div className="text-gray-600 flex flex-col items-center">
                        <Film size={48} className="mb-2 opacity-50"/>
                        <p>生成的视频将在此显示</p>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default VideoGeneratorModal;