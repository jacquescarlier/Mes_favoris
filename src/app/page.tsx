'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  const fetchBookmarks = async () => {
    try {
      const res = await fetch('/api/bookmarks');
      const data = await res.json();

      if (!res.ok || !Array.isArray(data)) {
        setCategories([]);
        return;
      }

      setCategories(data);
      if (data.length > 0 && !categoryId) {
        setCategoryId(String(data.at(0)?.id));
      }
    } catch {
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.category-card')) {
        setActiveCategoryId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, url, description, categoryId }),
    });
    setTitle('');
    setUrl('');
    setDescription('');
    fetchBookmarks();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/bookmarks/${id}`, { method: 'DELETE' });
    fetchBookmarks();
  };

  return (
    <main className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Mes Favoris
        </h1>

        <input
          type="text"
          placeholder="Rechercher un favori..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-400 px-4 py-2 rounded-lg focus:outline-none focus:border-sky-500 w-full md:w-72"
        />
      </div>

      {/* Formulaire d'ajout */}
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-800 p-4 rounded-xl mb-10 flex flex-wrap gap-3 shadow-lg"
      >
        <input
          type="text"
          placeholder="Nom du site"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="bg-slate-800 border border-slate-700 text-white placeholder-slate-400 p-2.5 rounded-lg flex-1 min-w-[180px] focus:outline-none focus:border-sky-500"
        />
        <input
          type="url"
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="bg-slate-800 border border-slate-700 text-white placeholder-slate-400 p-2.5 rounded-lg flex-1 min-w-[200px] focus:outline-none focus:border-sky-500"
        />
        <input
          type="text"
          placeholder="Note (optionnel)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-white placeholder-slate-400 p-2.5 rounded-lg flex-1 min-w-[160px] focus:outline-none focus:border-sky-500"
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg focus:outline-none focus:border-sky-500"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-sky-600 hover:bg-sky-500 text-white font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
        >
          Ajouter
        </button>
      </form>

      {/* Grille des catégories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {categories.map((cat) => {
          const filteredBookmarks = cat.bookmarks.filter(
            (bm: any) =>
              bm.title.toLowerCase().includes(search.toLowerCase()) ||
              bm.url.toLowerCase().includes(search.toLowerCase())
          );

          const isOpen =
            activeCategoryId === cat.id ||
            (search.trim() !== '' && filteredBookmarks.length > 0);

          return (
            <div
              key={cat.id}
              onMouseEnter={() => setActiveCategoryId(cat.id)}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`category-card bg-slate-900 border rounded-xl p-5 shadow-md transition-all duration-200 cursor-pointer ${
                isOpen
                  ? 'border-sky-500/60 ring-1 ring-sky-500/30'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* En-tête de la carte */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">{cat.name}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full">
                    {filteredBookmarks.length}
                  </span>
                  <span
                    className={`text-slate-400 text-xs transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-sky-400' : ''
                    }`}
                  >
                    ▼
                  </span>
                </div>
              </div>

              {/* Liste des raccourcis */}
              {isOpen && (
                <div className="mt-4 pt-4 border-t border-slate-800 cursor-default">
                  {filteredBookmarks.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">Aucun favori</p>
                  ) : (
                    <ul className="space-y-3">
                      {filteredBookmarks.map((bm: any) => (
                        <li key={bm.id}>
                          <a
                            href={bm.url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center justify-between gap-3 group bg-slate-800/50 hover:bg-slate-800 border border-transparent hover:border-slate-700 p-2.5 rounded-lg transition-all cursor-pointer"
                          >
                            <div className="min-w-0">
                              <span className="text-sky-400 group-hover:text-sky-300 font-medium block truncate transition-colors">
                                {bm.title}
                              </span>
                              {bm.description && (
                                <p className="text-xs text-slate-400 mt-0.5 truncate">
                                  {bm.description}
                                </p>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDelete(bm.id);
                              }}
                              title="Supprimer"
                              className="text-slate-500 hover:text-red-400 text-sm px-1.5 py-0.5 rounded opacity-70 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                            >
                              ✕
                            </button>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
