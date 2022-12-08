using System;
using System.Data.Entity;
using System.Linq;
using DasGlobal.Extensions;
using DasGlobal.Models;

namespace DasGlobal.Repositories
{
    public class RepoColaborador : BaseRepository
    {
        public RepoColaborador(UoWRepository UoW) : base(UoW)
        {
        }

        public IQueryable<Colaboradore> All()
        {
            return UoW.Db.Colaboradores;
        }

        public IQueryable<Colaboradore> BySucursal(int id)
        {
            return All().Where(x => x.SucursalId == id);
        }

        public bool CuiVerify(Colaboradore model)
        {
            model.Nombre = model.Nombre.CleanString();
            return All().Any(x => x.Nombre     == model.Nombre     &&
                                  x.SucursalId == model.SucursalId &&
                                  x.Id         != model.Id);
        }

        public IQueryable<Colaboradore> Find(int id)
        {
            return UoW.Db.Colaboradores.Where(x => x.Id == id);
        }


        public Colaboradore Create(Colaboradore model)
        {
            model.Nombre        = model.Nombre.CleanString();
            model.Cui           = model.Cui.CleanString();
            model.FechaRegistro = RepoUtils.Now();

            UoW.Db.Colaboradores.Add(model);
            UoW.SaveChanges();

            return model;
        }

        public Colaboradore Edit(Colaboradore modelRequest)
        {
            var model = Find(modelRequest.Id).FirstOrDefault();
            if (model == null) throw new Exception("El país no existe");

            model.Nombre     = modelRequest.Nombre.CleanString();
            model.Cui        = modelRequest.Cui.CleanString();
            model.SucursalId = modelRequest.SucursalId;

            UoW.Db.Entry(model).State = EntityState.Modified;
            UoW.SaveChanges();

            return model;
        }

        public int Delete(int id)
        {
            var model = Find(id).FirstOrDefault();
            if (model == null) throw new Exception("La Colaboradore no existe");

            UoW.Db.Colaboradores.Remove(model);
            UoW.SaveChanges();

            return id;
        }
    }
}