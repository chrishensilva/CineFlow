import React from 'react';
import { Filter, X } from 'lucide-react';
import './Filters.css';

const Filters = ({ genres, selectedGenre, onGenreChange, selectedYear, onYearChange, sortBy, onSortChange, onReset }) => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1990; i--) {
        years.push(i);
    }

    return (
        <div className="filters-container">
            <div className="filter-group">
                <label><Filter size={16} /> Genre</label>
                <select value={selectedGenre} onChange={(e) => onGenreChange(e.target.value)}>
                    <option value="">All Genres</option>
                    {genres.map(genre => (
                        <option key={genre.id} value={genre.id}>{genre.name}</option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label>Year</label>
                <select value={selectedYear} onChange={(e) => onYearChange(e.target.value)}>
                    <option value="">All Years</option>
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label>Sort By</label>
                <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
                    <option value="popularity.desc">Most Popular</option>
                    <option value="vote_average.desc">Highest Rated</option>
                    <option value="primary_release_date.desc">Newest First</option>
                    <option value="revenue.desc">Top Box Office</option>
                </select>
            </div>

            {(selectedGenre || selectedYear || sortBy !== 'popularity.desc') && (
                <button className="reset-btn" onClick={onReset}>
                    <X size={16} /> Reset
                </button>
            )}
        </div>
    );
};

export default Filters;
