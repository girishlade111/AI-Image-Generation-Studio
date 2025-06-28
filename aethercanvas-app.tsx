import React, { useState, useRef, useCallback } from 'react';
import { Camera, Download, Heart, Search, Settings, Sparkles, Upload, Wand2, Grid, Image, Plus, Minus, RotateCcw, Zap, Users, Eye, EyeOff, Share2, RefreshCw, Palette, Sliders, Stars, Filter, Clock, Trash2, Archive } from 'lucide-react';

const AetherCanvas = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [darkMode, setDarkMode] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [cfgScale, setCfgScale] = useState(7);
  const [seed, setSeed] = useState('');
  const [numImages, setNumImages] = useState(1);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [denoiseStrength, setDenoiseStrength] = useState(0.75);
  const [showPromptAssistant, setShowPromptAssistant] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [favoriteImages, setFavoriteImages] = useState(new Set());
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [mixedStyles, setMixedStyles] = useState([]);
  const [styleWeights, setStyleWeights] = useState({});
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const fileInputRef = useRef(null);

  const styles = [
    'Photorealistic', 'Anime', 'Digital Art', 'Concept Art', 'Watercolor', 
    'Abstract', 'Cyberpunk', 'Fantasy', 'Oil Painting', 'Pixel Art',
    'Surreal', 'Minimalist', 'Vintage', 'Neon', 'Gothic', 'Steampunk'
  ];

  const aspectRatios = [
    { label: 'Square', value: '1:1', dims: '512×512' },
    { label: 'Landscape', value: '16:9', dims: '768×432' },
    { label: 'Portrait', value: '9:16', dims: '432×768' },
    { label: 'Classic', value: '4:3', dims: '640×480' },
    { label: 'Photo', value: '3:4', dims: '480×640' }
  ];

  const promptSuggestions = [
    'highly detailed', 'masterpiece', 'professional photography', 'vibrant colors',
    'dramatic lighting', 'cinematic composition', 'ethereal atmosphere', 'intricate details'
  ];

  const mockImages = [
    { id: 1, url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop', prompt: 'Majestic mountain landscape at sunset', style: 'Photorealistic', timestamp: Date.now() - 86400000 },
    { id: 2, url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop', prompt: 'Futuristic cyberpunk cityscape', style: 'Cyberpunk', timestamp: Date.now() - 172800000 },
    { id: 3, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', prompt: 'Ethereal fantasy forest with magical creatures', style: 'Fantasy', timestamp: Date.now() - 259200000 }
  ];

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const newImages = Array.from({ length: numImages }, (_, i) => ({
        id: Date.now() + i,
        url: `https://images.unsplash.com/photo-${1500000000 + Math.random() * 100000000 | 0}?w=512&h=512&fit=crop`,
        prompt: prompt,
        negativePrompt: negativePrompt,
        style: selectedStyle,
        cfgScale: cfgScale,
        seed: seed || Math.random().toString(36).substr(2, 9),
        aspectRatio: aspectRatio,
        timestamp: Date.now()
      }));
      
      setGeneratedImages(newImages);
      setGallery(prev => [...newImages, ...prev]);
      setIsGenerating(false);
    }, 3000);
  }, [prompt, negativePrompt, selectedStyle, cfgScale, seed, numImages, aspectRatio]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const expandPrompt = () => {
    if (prompt.trim()) {
      const expanded = `${prompt}, highly detailed, masterpiece quality, professional composition, vibrant colors, dramatic lighting`;
      setPrompt(expanded);
    }
  };

  const randomizeSeed = () => {
    setSeed(Math.random().toString(36).substr(2, 9));
  };

  const toggleFavorite = (imageId) => {
    setFavoriteImages(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(imageId)) {
        newFavorites.delete(imageId);
      } else {
        newFavorites.add(imageId);
      }
      return newFavorites;
    });
  };

  const addStyleToMix = (style) => {
    if (!mixedStyles.includes(style) && mixedStyles.length < 3) {
      setMixedStyles([...mixedStyles, style]);
      setStyleWeights({...styleWeights, [style]: 1});
    }
  };

  const removeStyleFromMix = (style) => {
    setMixedStyles(mixedStyles.filter(s => s !== style));
    const newWeights = {...styleWeights};
    delete newWeights[style];
    setStyleWeights(newWeights);
  };

  const filteredGallery = gallery.filter(image => {
    const matchesSearch = searchQuery === '' || 
      image.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (image.style && image.style.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = galleryFilter === 'all' || 
      (galleryFilter === 'favorites' && favoriteImages.has(image.id)) ||
      (galleryFilter === 'recent' && Date.now() - image.timestamp < 86400000);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`border-b transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                AetherCanvas
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                {darkMode ? '🌙' : '☀️'}
              </button>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full text-sm">
                <Zap className="w-4 h-4" />
                <span>∞ Credits</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className={`border-b transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'generate', label: 'Generate', icon: Wand2 },
              { id: 'gallery', label: 'Gallery', icon: Grid },
              { id: 'community', label: 'Community', icon: Users }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-400'
                    : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'generate' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Generation Controls */}
            <div className="lg:col-span-1 space-y-6">
              <div className={`p-6 rounded-xl border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                  Text-to-Image
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Prompt</label>
                    <div className="relative">
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe the image you want to create..."
                        className={`w-full p-3 rounded-lg border resize-none transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        rows={3}
                      />
                      <button
                        onClick={() => setShowPromptAssistant(!showPromptAssistant)}
                        className="absolute top-2 right-2 p-1 rounded text-purple-400 hover:bg-purple-500/20"
                      >
                        <Stars className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {showPromptAssistant && (
                      <div className={`mt-2 p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {promptSuggestions.map(suggestion => (
                            <button
                              key={suggestion}
                              onClick={() => setPrompt(prompt + ' ' + suggestion)}
                              className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/30"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={expandPrompt}
                          className="w-full mt-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded text-sm hover:opacity-90"
                        >
                          Expand Prompt with AI
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Negative Prompt</label>
                    <textarea
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      placeholder="What to avoid in the image..."
                      className={`w-full p-3 rounded-lg border resize-none transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Style Presets</label>
                    <div className="grid grid-cols-2 gap-2">
                      {styles.map(style => (
                        <button
                          key={style}
                          onClick={() => setSelectedStyle(selectedStyle === style ? '' : style)}
                          className={`p-2 rounded-lg text-sm transition-colors ${
                            selectedStyle === style
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : darkMode
                                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Style Mixer */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center">
                      <Palette className="w-4 h-4 mr-1" />
                      Style Mixer
                    </label>
                    <div className="space-y-2">
                      {mixedStyles.map(style => (
                        <div key={style} className="flex items-center space-x-2">
                          <span className="flex-1 text-sm">{style}</span>
                          <input
                            type="range"
                            min="0.1"
                            max="2"
                            step="0.1"
                            value={styleWeights[style] || 1}
                            onChange={(e) => setStyleWeights({...styleWeights, [style]: parseFloat(e.target.value)})}
                            className="flex-1"
                          />
                          <button
                            onClick={() => removeStyleFromMix(style)}
                            className="p-1 text-red-400 hover:text-red-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {mixedStyles.length < 3 && (
                        <select
                          onChange={(e) => e.target.value && addStyleToMix(e.target.value)}
                          value=""
                          className={`w-full p-2 rounded border ${
                            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                          }`}
                        >
                          <option value="">Add style to mix...</option>
                          {styles.filter(s => !mixedStyles.includes(s)).map(style => (
                            <option key={style} value={style}>{style}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">CFG Scale</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="range"
                          min="1"
                          max="20"
                          value={cfgScale}
                          onChange={(e) => setCfgScale(parseInt(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-sm w-8 text-center">{cfgScale}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Images</label>
                      <select
                        value={numImages}
                        onChange={(e) => setNumImages(parseInt(e.target.value))}
                        className={`w-full p-2 rounded border ${
                          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                        }`}
                      >
                        {[1, 2, 3, 4].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Aspect Ratio</label>
                    <div className="grid grid-cols-2 gap-2">
                      {aspectRatios.map(ratio => (
                        <button
                          key={ratio.value}
                          onClick={() => setAspectRatio(ratio.value)}
                          className={`p-2 rounded text-sm transition-colors ${
                            aspectRatio === ratio.value
                              ? 'bg-purple-500 text-white'
                              : darkMode
                                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          <div>{ratio.label}</div>
                          <div className="text-xs opacity-70">{ratio.dims}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Seed</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={seed}
                        onChange={(e) => setSeed(e.target.value)}
                        placeholder="Random"
                        className={`flex-1 p-2 rounded border ${
                          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                        }`}
                      />
                      <button
                        onClick={randomizeSeed}
                        className="p-2 bg-gray-600 hover:bg-gray-500 rounded"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image-to-Image */}
              <div className={`p-6 rounded-xl border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Image className="w-5 h-5 mr-2 text-blue-400" />
                  Image-to-Image
                </h3>
                
                <div className="space-y-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      darkMode 
                        ? 'border-gray-600 hover:border-gray-500 bg-gray-700/50' 
                        : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                    }`}
                  >
                    {uploadedImage ? (
                      <div className="space-y-2">
                        <img src={uploadedImage} alt="Uploaded" className="w-full h-32 object-cover rounded" />
                        <p className="text-sm">Click to change image</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 mx-auto text-gray-400" />
                        <p>Click to upload or drag & drop</p>
                      </div>
                    )}
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Denoising Strength</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={denoiseStrength}
                        onChange={(e) => setDenoiseStrength(parseFloat(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm w-12 text-center">{denoiseStrength}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Generation Results */}
            <div className="lg:col-span-2">
              <div className={`p-6 rounded-xl border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Generated Images</h2>
                  <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      !prompt.trim() || isGenerating
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105'
                    }`}
                  >
                    {isGenerating ? (
                      <div className="flex items-center space-x-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Generating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Generate</span>
                      </div>
                    )}
                  </button>
                </div>

                {isGenerating && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                      </div>
                      <span className="text-sm">Generating...</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {Array(numImages).fill(0).map((_, i) => (
                        <div key={i} className={`aspect-square rounded-lg animate-pulse ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                      ))}
                    </div>
                  </div>
                )}

                {generatedImages.length > 0 && !isGenerating && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {generatedImages.map(image => (
                        <div key={image.id} className="group relative">
                          <img
                            src={image.url}
                            alt={image.prompt}
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                            <button
                              onClick={() => toggleFavorite(image.id)}
                              className={`p-2 rounded-full ${favoriteImages.has(image.id) ? 'text-red-400' : 'text-white'} hover:bg-white/20`}
                            >
                              <Heart className={`w-5 h-5 ${favoriteImages.has(image.id) ? 'fill-current' : ''}`} />
                            </button>
                            <button className="p-2 rounded-full text-white hover:bg-white/20">
                              <Download className="w-5 h-5" />
                            </button>
                            <button className="p-2 rounded-full text-white hover:bg-white/20">
                              <Wand2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>Download All</span>
                      </button>
                    </div>
                  </div>
                )}

                {generatedImages.length === 0 && !isGenerating && (
                  <div className="text-center py-12">
                    <Camera className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Your generated images will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-6">
            {/* Gallery Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search images..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-10 pr-4 py-2 rounded-lg border ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <select
                  value={galleryFilter}
                  onChange={(e) => setGalleryFilter(e.target.value)}
                  className={`px-4 py-2 rounded-lg border ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="all">All Images</option>
                  <option value="favorites">Favorites</option>
                  <option value="recent">Recent</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-lg bg-gray-600 hover:bg-gray-500">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg bg-gray-600 hover:bg-gray-500">
                  <Clock className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...mockImages, ...filteredGallery].map(image => (
                <div key={image.id} className="group relative">
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <button
                        onClick={() => toggleFavorite(image.id)}
                        className={`p-1 rounded-full ${favoriteImages.has(image.id) ? 'text-red-400' : 'text-white'} hover:bg-white/20`}
                      >
                        <Heart className={`w-4 h-4 ${favoriteImages.has(image.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button className="p-1 rounded-full text-white hover:bg-white/20">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="bg-black/70 rounded p-2">
                        <p className="text-white text-xs truncate">{image.prompt}</p>
                        {image.style && (
                          <p className="text-gray-300 text-xs">{image.style}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredGallery.length === 0 && mockImages.length === 0 && (
              <div className="text-center py-12">
                <Grid className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No images found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'community' && (
          <div className="space-y-6">
            {/* Community Header */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Community Showcase
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Discover amazing creations from the AetherCanvas community. Get inspired and share your own masterpieces.
              </p>
            </div>

            {/* Community Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex items-center space-x-4">
                <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90">
                  Share Creation
                </button>
                <select className={`px-4 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
                }`}>
                  <option value="trending">Trending</option>
                  <option value="recent">Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="featured">Featured</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-lg bg-gray-600 hover:bg-gray-500">
                  <Search className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg bg-gray-600 hover:bg-gray-500">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Community Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: 1,
                  url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
                  prompt: 'Mystical forest with glowing mushrooms and fairy lights',
                  author: 'ArtistMage',
                  likes: 1240,
                  style: 'Fantasy',
                  featured: true
                },
                {
                  id: 2,
                  url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=600&fit=crop',
                  prompt: 'Neon-lit cyberpunk street with rain reflections',
                  author: 'DigitalDreamer',
                  likes: 987,
                  style: 'Cyberpunk',
                  featured: false
                },
                {
                  id: 3,
                  url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=600&fit=crop',
                  prompt: 'Majestic dragon soaring over misty mountains',
                  author: 'MythCreator',
                  likes: 2156,
                  style: 'Fantasy',
                  featured: true
                },
                {
                  id: 4,
                  url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop',
                  prompt: 'Abstract geometric patterns in vibrant colors',
                  author: 'GeometryGuru',
                  likes: 756,
                  style: 'Abstract',
                  featured: false
                },
                {
                  id: 5,
                  url: 'https://images.unsplash.com/photo-1464822759844-d150baec4493?w=600&h=600&fit=crop',
                  prompt: 'Serene zen garden with flowing water',
                  author: 'ZenMaster',
                  likes: 892,
                  style: 'Minimalist',
                  featured: false
                },
                {
                  id: 6,
                  url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
                  prompt: 'Steampunk airship floating among clouds',
                  author: 'SteamEngineer',
                  likes: 1389,
                  style: 'Steampunk',
                  featured: true
                }
              ].map(item => (
                <div key={item.id} className={`group relative overflow-hidden rounded-xl border transition-all hover:scale-105 hover:shadow-2xl ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } ${item.featured ? 'ring-2 ring-purple-500' : ''}`}>
                  {item.featured && (
                    <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full">
                      Featured
                    </div>
                  )}
                  
                  <div className="relative">
                    <img
                      src={item.url}
                      alt={item.prompt}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-4 left-4 right-4 space-y-2">
                        <button className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 flex items-center justify-center space-x-2">
                          <Wand2 className="w-4 h-4" />
                          <span>Remix</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div className="flex items-start space-x-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-2">{item.prompt}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded">
                            {item.style}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-semibold">
                            {item.author.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">@{item.author}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-red-400">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{item.likes}</span>
                        </button>
                        <button className="text-gray-500 hover:text-blue-400">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center">
              <button className={`px-6 py-3 rounded-lg border transition-colors ${
                darkMode 
                  ? 'border-gray-700 hover:bg-gray-800 text-gray-300' 
                  : 'border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}>
                Load More Creations
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Features Modal/Sidebar could go here */}
      {/* Batch Generation, In-painting, Out-painting features would be implemented as modals or expanded sections */}
    </div>
  );
};

export default AetherCanvas;