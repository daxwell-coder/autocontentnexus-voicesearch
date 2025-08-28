import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Sparkles, Image, Volume2, FileText, Loader2, Download, Play, Pause } from 'lucide-react';
import { supabase } from '../lib/supabase';

type ContentType = 'text' | 'image' | 'audio';

interface GeneratedContent {
  type: ContentType;
  data: any;
  timestamp: string;
}

export function ContentGenerationForm() {
  const [contentType, setContentType] = useState<ContentType>('text');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Form states for different content types
  const [textForm, setTextForm] = useState({
    topic: '',
    aiProvider: 'gemini',
    contentType: 'article',
    targetAudience: 'general',
    tone: 'professional',
    wordCount: 1000,
    seoKeywords: '',
    sustainabilityFocus: true,
    includeImages: false
  });

  const [imageForm, setImageForm] = useState({
    prompt: '',
    style: 'photorealistic',
    size: '1024x1024',
    quality: 'standard'
  });

  const [audioForm, setAudioForm] = useState({
    text: '',
    voiceStyle: 'professional',
    speed: 1.0,
    format: 'mp3'
  });

  const handleContentTypeChange = (type: ContentType) => {
    setContentType(type);
    setGeneratedContent(null);
  };

  const handleTextGeneration = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('enhanced-text-generation', {
        body: {
          topic: textForm.topic,
          ai_provider: textForm.aiProvider,
          content_type: textForm.contentType,
          target_audience: textForm.targetAudience,
          tone: textForm.tone,
          word_count: textForm.wordCount,
          seo_keywords: textForm.seoKeywords.split(',').map(k => k.trim()).filter(k => k),
          sustainability_focus: textForm.sustainabilityFocus,
          include_images: textForm.includeImages
        }
      });

      if (error) throw error;
      
      setGeneratedContent({
        type: 'text',
        data: data.data || data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Text generation error:', error);
      alert('Failed to generate text content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageGeneration = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('multimodal-image-generation', {
        body: {
          prompt: imageForm.prompt,
          style: imageForm.style,
          size: imageForm.size,
          quality: imageForm.quality
        }
      });

      if (error) throw error;
      
      setGeneratedContent({
        type: 'image',
        data: data.data || data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Image generation error:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAudioGeneration = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('multimodal-audio-generation', {
        body: {
          text: audioForm.text,
          voice_style: audioForm.voiceStyle,
          speed: audioForm.speed,
          format: audioForm.format
        }
      });

      if (error) throw error;
      
      setGeneratedContent({
        type: 'audio',
        data: data.data || data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Audio generation error:', error);
      alert('Failed to generate audio. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = () => {
    switch (contentType) {
      case 'text':
        handleTextGeneration();
        break;
      case 'image':
        handleImageGeneration();
        break;
      case 'audio':
        handleAudioGeneration();
        break;
    }
  };

  const toggleAudioPlayback = () => {
    if (!generatedContent || generatedContent.type !== 'audio') return;
    
    if (audioElement) {
      if (audioPlaying) {
        audioElement.pause();
        setAudioPlaying(false);
      } else {
        audioElement.play();
        setAudioPlaying(true);
      }
    } else {
      const audio = new Audio(generatedContent.data.audio.url);
      audio.onended = () => setAudioPlaying(false);
      audio.onpause = () => setAudioPlaying(false);
      audio.play();
      setAudioElement(audio);
      setAudioPlaying(true);
    }
  };

  const downloadContent = () => {
    if (!generatedContent) return;
    
    let content, filename, type;
    
    switch (generatedContent.type) {
      case 'text':
        content = generatedContent.data.content?.text || 'No content available';
        filename = `generated-${generatedContent.data.content?.content_type || 'text'}-${Date.now()}.txt`;
        type = 'text/plain';
        break;
      case 'image':
        // For images, we'll open in a new tab since it's a URL
        window.open(generatedContent.data.image?.url, '_blank');
        return;
      case 'audio':
        // For audio, we'll open in a new tab since it's a URL
        window.open(generatedContent.data.audio?.url, '_blank');
        return;
    }
    
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Content Type Selector */}
      <div>
        <Label className="text-base font-medium text-gray-900 mb-3 block">Content Type *</Label>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleContentTypeChange('text')}
            className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
              contentType === 'text'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <FileText className="h-6 w-6" />
            <div className="text-center">
              <div className="font-medium">Text Article</div>
              <div className="text-xs text-gray-500">In-depth informational content</div>
            </div>
          </button>
          
          <button
            onClick={() => handleContentTypeChange('image')}
            className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
              contentType === 'image'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Image className="h-6 w-6" />
            <div className="text-center">
              <div className="font-medium">Accompanying Image</div>
              <div className="text-xs text-gray-500">AI-generated visual content</div>
            </div>
          </button>
          
          <button
            onClick={() => handleContentTypeChange('audio')}
            className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
              contentType === 'audio'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Volume2 className="h-6 w-6" />
            <div className="text-center">
              <div className="font-medium">Audio Summary</div>
              <div className="text-xs text-gray-500">Text-to-speech narration</div>
            </div>
          </button>
        </div>
      </div>

      {/* Dynamic Form Fields */}
      {contentType === 'text' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="topic">Topic or Title *</Label>
            <Input
              id="topic"
              placeholder="e.g., Sustainable Living Tips for Beginners"
              value={textForm.topic}
              onChange={(e) => setTextForm({ ...textForm, topic: e.target.value })}
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>AI Provider *</Label>
              <Select value={textForm.aiProvider} onValueChange={(value) => setTextForm({ ...textForm, aiProvider: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini">✨ Google Gemini Pro</SelectItem>
                  <SelectItem value="claude">🧠 Anthropic Claude</SelectItem>
                  <SelectItem value="openai">🚀 OpenAI GPT-4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Content Type *</Label>
              <Select value={textForm.contentType} onValueChange={(value) => setTextForm({ ...textForm, contentType: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="blog-post">Blog Post</SelectItem>
                  <SelectItem value="product-review">Product Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Target Audience</Label>
              <Select value={textForm.targetAudience} onValueChange={(value) => setTextForm({ ...textForm, targetAudience: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eco-conscious">Eco-conscious consumers</SelectItem>
                  <SelectItem value="environmental-activists">Environmental activists</SelectItem>
                  <SelectItem value="sustainable-business">Sustainable business owners</SelectItem>
                  <SelectItem value="green-tech">Green technology enthusiasts</SelectItem>
                  <SelectItem value="families">Families seeking sustainable living</SelectItem>
                  <SelectItem value="young-professionals">Young professionals</SelectItem>
                  <SelectItem value="students-researchers">Students and researchers</SelectItem>
                  <SelectItem value="general">General public</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Tone</Label>
              <Select value={textForm.tone} onValueChange={(value) => setTextForm({ ...textForm, tone: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                  <SelectItem value="conversational">Conversational</SelectItem>
                  <SelectItem value="authoritative">Authoritative</SelectItem>
                  <SelectItem value="inspirational">Inspirational</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="wordCount">Word Count</Label>
            <Input
              id="wordCount"
              type="number"
              min="100"
              max="15000"
              value={textForm.wordCount}
              onChange={(e) => setTextForm({ ...textForm, wordCount: parseInt(e.target.value) })}
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">Between 500 and 15,000 words</p>
          </div>
          
          <div>
            <Label htmlFor="seoKeywords">SEO Keywords</Label>
            <Input
              id="seoKeywords"
              placeholder="Comma-separated keywords"
              value={textForm.seoKeywords}
              onChange={(e) => setTextForm({ ...textForm, seoKeywords: e.target.value })}
              className="mt-1"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                checked={textForm.sustainabilityFocus}
                onCheckedChange={(checked) => setTextForm({ ...textForm, sustainabilityFocus: checked })}
              />
              <Label>Include eco-friendly insights</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={textForm.includeImages}
                onCheckedChange={(checked) => setTextForm({ ...textForm, includeImages: checked })}
              />
              <Label>Add image placeholders</Label>
            </div>
          </div>
        </div>
      )}
      
      {contentType === 'image' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="imagePrompt">Image Prompt *</Label>
            <Textarea
              id="imagePrompt"
              placeholder="Describe the image you want to generate..."
              value={imageForm.prompt}
              onChange={(e) => setImageForm({ ...imageForm, prompt: e.target.value })}
              className="mt-1 min-h-[100px]"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Style</Label>
              <Select value={imageForm.style} onValueChange={(value) => setImageForm({ ...imageForm, style: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photorealistic">Photorealistic</SelectItem>
                  <SelectItem value="digital-art">Digital Art</SelectItem>
                  <SelectItem value="watercolor">Watercolor</SelectItem>
                  <SelectItem value="oil-painting">Oil Painting</SelectItem>
                  <SelectItem value="sketch">Sketch</SelectItem>
                  <SelectItem value="cartoon">Cartoon</SelectItem>
                  <SelectItem value="abstract">Abstract</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Size</Label>
              <Select value={imageForm.size} onValueChange={(value) => setImageForm({ ...imageForm, size: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="512x512">512x512 (Square)</SelectItem>
                  <SelectItem value="1024x1024">1024x1024 (Square)</SelectItem>
                  <SelectItem value="1024x768">1024x768 (Landscape)</SelectItem>
                  <SelectItem value="768x1024">768x1024 (Portrait)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label>Quality</Label>
            <Select value={imageForm.quality} onValueChange={(value) => setImageForm({ ...imageForm, quality: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="hd">HD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      {contentType === 'audio' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="audioText">Text Content *</Label>
            <Textarea
              id="audioText"
              placeholder="Enter the text you want to convert to speech..."
              value={audioForm.text}
              onChange={(e) => setAudioForm({ ...audioForm, text: e.target.value })}
              className="mt-1 min-h-[120px]"
            />
            <p className="text-sm text-gray-500 mt-1">
              {audioForm.text.length}/5000 characters
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Voice Style</Label>
              <Select value={audioForm.voiceStyle} onValueChange={(value) => setAudioForm({ ...audioForm, voiceStyle: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="authoritative">Authoritative</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                  <SelectItem value="narrative">Narrative</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Speed</Label>
              <Select value={audioForm.speed.toString()} onValueChange={(value) => setAudioForm({ ...audioForm, speed: parseFloat(value) })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">0.5x (Slow)</SelectItem>
                  <SelectItem value="0.75">0.75x</SelectItem>
                  <SelectItem value="1.0">1.0x (Normal)</SelectItem>
                  <SelectItem value="1.25">1.25x</SelectItem>
                  <SelectItem value="1.5">1.5x (Fast)</SelectItem>
                  <SelectItem value="2.0">2.0x (Very Fast)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isGenerating || 
          (contentType === 'text' && !textForm.topic) ||
          (contentType === 'image' && !imageForm.prompt) ||
          (contentType === 'audio' && !audioForm.text)
        }
        className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating {contentType === 'text' ? 'Content' : contentType === 'image' ? 'Image' : 'Audio'}...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate {contentType === 'text' ? 'Content' : contentType === 'image' ? 'Image' : 'Audio'}
          </>
        )}
      </Button>

      {/* Generated Content Display */}
      {generatedContent && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Generated {generatedContent.type === 'text' ? 'Content' : generatedContent.type === 'image' ? 'Image' : 'Audio'}
            </h3>
            <div className="flex space-x-2">
              {generatedContent.type === 'audio' && (
                <Button
                  onClick={toggleAudioPlayback}
                  variant="outline"
                  size="sm"
                >
                  {audioPlaying ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </>
                  )}
                </Button>
              )}
              <Button onClick={downloadContent} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
          
          {generatedContent.type === 'text' && (
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {generatedContent.data.content?.text || 'No content available'}
              </div>
              <div className="mt-4 text-sm text-gray-500 border-t pt-4">
                <p>Word Count: {generatedContent.data.content?.word_count || 0}</p>
                <p>AI Provider: {generatedContent.data.content?.ai_provider}</p>
                <p>Generated: {new Date(generatedContent.timestamp).toLocaleString()}</p>
              </div>
            </div>
          )}
          
          {generatedContent.type === 'image' && (
            <div className="space-y-4">
              <img
                src={generatedContent.data.image?.url}
                alt={generatedContent.data.image?.prompt}
                className="max-w-full h-auto rounded-lg shadow-md"
              />
              <div className="text-sm text-gray-600">
                <p><strong>Prompt:</strong> {generatedContent.data.image?.prompt}</p>
                <p><strong>Style:</strong> {generatedContent.data.image?.style}</p>
                <p><strong>Size:</strong> {generatedContent.data.image?.size}</p>
                <p><strong>Generated:</strong> {new Date(generatedContent.timestamp).toLocaleString()}</p>
              </div>
            </div>
          )}
          
          {generatedContent.type === 'audio' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={toggleAudioPlayback}
                    variant="outline"
                    size="lg"
                  >
                    {audioPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6" />
                    )}
                  </Button>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {generatedContent.data.audio?.voice_name || 'Generated Audio'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {generatedContent.data.audio?.duration || 0}s • {generatedContent.data.audio?.format?.toUpperCase() || 'MP3'}
                    </div>
                  </div>
                  <Volume2 className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p><strong>Text:</strong> {generatedContent.data.audio?.text?.substring(0, 200) + (generatedContent.data.audio?.text?.length > 200 ? '...' : '')}</p>
                <p><strong>Voice Style:</strong> {generatedContent.data.audio?.voice_style}</p>
                <p><strong>Speed:</strong> {generatedContent.data.audio?.speed}x</p>
                <p><strong>Generated:</strong> {new Date(generatedContent.timestamp).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
