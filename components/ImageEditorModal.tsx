import React, { useState } from 'react';
import Button from './Button';
import { editImageBrowser } from '../services/geminiService';
import { Wand2, X, Loader2 } from 'lucide-react';

interface Props {
  currentImage: string;
  onSave: (newImage: string) => void;
  onClose: () => void;
}

const ImageEditorModal: React.FC<Props> = ({ currentImage, onSave, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setError(null);
    try {
      const newImg = await editImageBrowser(currentImage, prompt);
      setPreviewImage(newImg);
    } catch (e) {
      setError("生成失败，请重试。");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (previewImage) {
      onSave(previewImage);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 border-2 border-indigo-500 rounded-2xl p-6 flex flex-col space-y-4 shadow-[0_0_50px_rgba(99,102,241,0.3)]">
        
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-comic text-indigo-400 flex items-center gap-2">
            <Wand2 /> 幻术·易容
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
        </div>

        <div className="flex justify-center bg-black/50 p-4 rounded-lg min-h-[200px] items-center relative">
           {loading ? (
             <div className="flex flex-col items-center gap-2 text-indigo-300">
               <Loader2 className="animate-spin" size={32}/>
               <span>施术中...</span>
             </div>
           ) : (
             <img 
               src={previewImage || currentImage} 
               alt="Character" 
               className="w-48 h-48 object-cover rounded-full border-4 border-indigo-500/50 shadow-lg"
             />
           )}
           {error && <div className="absolute bottom-2 text-red-400 text-sm">{error}</div>}
        </div>

        <div className="space-y-2">
           <label className="text-sm text-gray-400">输入咒语 (例如: "变为黑白风格", "加上墨镜")</label>
           <div className="flex gap-2">
             <input 
               type="text" 
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
               placeholder="描述想要的效果..."
               className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
               onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
             />
             <Button onClick={handleGenerate} disabled={loading || !prompt} variant="secondary">
               生成
             </Button>
           </div>
        </div>

        {previewImage && (
          <div className="flex gap-2 pt-2">
            <Button onClick={() => setPreviewImage(null)} fullWidth variant="secondary">撤销</Button>
            <Button onClick={handleSave} fullWidth>保存</Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ImageEditorModal;