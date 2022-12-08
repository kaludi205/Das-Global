using System;
using System.Data.Entity;
using System.Linq;
using DasGlobal.Extensions;
using DasGlobal.Models;

namespace DasGlobal.Repositories
{
    public class RepoSucursal : BaseRepository
    {
        public RepoSucursal(UoWRepository UoW) : base(UoW)
        {
        }

        public IQueryable<Sucursale> All()
        {
            return UoW.Db.Sucursales;
        }

        public IQueryable<Sucursale> ByEmpresa(int id)
        {
            return All().Where(x => x.EmpresaId == id);
        }

        public bool NombreVerify(Sucursale model)
        {
            model.Nombre = model.Nombre.CleanString();
            return All().Any(x => x.Nombre    == model.Nombre    &&
                                  x.EmpresaId == model.EmpresaId &&
                                  x.Id        != model.Id);
        }

        public IQueryable<Sucursale> Find(int id)
        {
            return UoW.Db.Sucursales.Where(x => x.Id == id);
        }


        public Sucursale Create(Sucursale model)
        {
            model.Nombre        = model.Nombre.CleanString();
            model.Direccion     = model.Direccion.CleanString();
            model.FechaRegistro = RepoUtils.Now();

            UoW.Db.Sucursales.Add(model);
            UoW.SaveChanges();

            return model;
        }

        public Sucursale Edit(Sucursale modelRequest)
        {
            var model = Find(modelRequest.Id).FirstOrDefault();
            if (model == null) throw new Exception("La Sucursale no existe");

            model.Nombre    = modelRequest.Nombre.CleanString();
            model.Direccion = modelRequest.Direccion.CleanString();
            model.Telefono  = modelRequest.Telefono.CleanString();
            model.EmpresaId = modelRequest.EmpresaId;

            UoW.Db.Entry(model).State = EntityState.Modified;
            UoW.SaveChanges();

            return model;
        }

        public int Delete(int id)
        {
            var model = Find(id).FirstOrDefault();
            if (model == null) throw new Exception("La Sucursale no existe");

            UoW.Db.Sucursales.Remove(model);
            UoW.SaveChanges();

            return id;
        }
    }
}