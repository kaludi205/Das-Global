using System;
using DasGlobal.Classes;
using DasGlobal.Models;

namespace DasGlobal.Repositories
{
    public abstract class BaseRepository
    {
        protected UoWRepository UoW;
        private   Utils         _utils;


        public Utils RepoUtils => _utils ??= new Utils();

        public BaseRepository(UoWRepository UoW)
        {
            this.UoW = UoW;
        }
    }
}