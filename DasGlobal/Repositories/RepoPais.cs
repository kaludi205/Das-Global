using System;
using System.Data.Entity;
using System.Linq;
using DasGlobal.Extensions;
using DasGlobal.Models;

namespace DasGlobal.Repositories
{
    public class RepoPais : BaseRepository
    {
        public RepoPais(UoWRepository UoW) : base(UoW)
        {
        }

        public IQueryable<Pais> All()
        {
            return UoW.Db.Paises;
        }

        public bool NombreVerify(Pais model)
        {
            model.Nombre = model.Nombre.CleanString();
            return All().Any(x => x.Nombre == model.Nombre &&
                                  x.Id     != model.Id);
        }

        public bool CodigoVerify(Pais model)
        {
            model.Codigo = model.Codigo.CleanString();
            return All().Any(x => x.Codigo == model.Codigo &&
                                  x.Id     != model.Id);
        }

        public IQueryable<Pais> Find(int id)
        {
            return UoW.Db.Paises.Where(x => x.Id == id);
        }


        public Pais Create(Pais model)
        {
            model.Nombre        = model.Nombre.CleanString();
            model.Codigo        = model.Codigo.CleanString();
            model.FechaRegistro = RepoUtils.Now();

            UoW.Db.Paises.Add(model);
            UoW.SaveChanges();

            return model;
        }

        public Pais Edit(Pais modelRequest)
        {
            var model = Find(modelRequest.Id).FirstOrDefault();
            if (model == null) throw new Exception("El país no existe");

            model.Nombre = modelRequest.Nombre.CleanString();
            model.Codigo = modelRequest.Codigo.CleanString();

            UoW.Db.Entry(model).State = EntityState.Modified;
            UoW.SaveChanges();

            return model;
        }

        private int Delete(int id)
        {
            var model = Find(id).FirstOrDefault();
            if (model == null) throw new Exception("El país no existe");

            UoW.Db.Paises.Remove(model);
            UoW.SaveChanges();

            return id;
        }
    }
}