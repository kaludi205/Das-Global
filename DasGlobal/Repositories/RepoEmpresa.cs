using System;
using System.Data.Entity;
using System.Linq;
using DasGlobal.Extensions;
using DasGlobal.Models;

namespace DasGlobal.Repositories
{
    public class RepoEmpresa : BaseRepository
    {
        public RepoEmpresa(UoWRepository UoW) : base(UoW)
        {
        }

        public IQueryable<Empresa> All()
        {
            return UoW.Db.Empresas;
        }

        public bool NombreVerify(Empresa model)
        {
            model.Nombre = model.Nombre.CleanString();
            return All().Any(x => x.Nombre == model.Nombre &&
                                  x.PaisId == model.PaisId &&
                                  x.Id     != model.Id);
        }

        public IQueryable<Empresa> Find(int id)
        {
            return UoW.Db.Empresas.Where(x => x.Id == id);
        }


        public Empresa Create(Empresa model)
        {
            model.Nombre        = model.Nombre.CleanString();
            model.FechaRegistro = RepoUtils.Now();

            UoW.Db.Empresas.Add(model);
            UoW.SaveChanges();

            return model;
        }

        public Empresa Edit(Empresa modelRequest)
        {
            var model = Find(modelRequest.Id).FirstOrDefault();
            if (model == null) throw new Exception("El país no existe");

            model.Nombre = modelRequest.Nombre.CleanString();
            model.PaisId = modelRequest.PaisId;

            UoW.Db.Entry(model).State = EntityState.Modified;
            UoW.SaveChanges();

            return model;
        }

        public int Delete(int id)
        {
            var model = Find(id).FirstOrDefault();
            if (model == null) throw new Exception("La empresa no existe");

            UoW.Db.Empresas.Remove(model);
            UoW.SaveChanges();

            return id;
        }
    }
}