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

        public IQueryable<Sucursal> All()
        {
            return UoW.Db.Sucursals;
        }

        public IQueryable<Sucursal> ByEmpresa(int id)
        {
            return All().Where(x => x.EmpresaId == id);
        }

        public bool NombreVerify(Sucursal model)
        {
            model.Nombre = model.Nombre.CleanString();
            return All().Any(x => x.Nombre    == model.Nombre    &&
                                  x.EmpresaId == model.EmpresaId &&
                                  x.Id        != model.Id);
        }

        public IQueryable<Sucursal> Find(int id)
        {
            return UoW.Db.Sucursals.Where(x => x.Id == id);
        }


        public Sucursal Create(Sucursal model)
        {
            model.Nombre        = model.Nombre.CleanString();
            model.Direccion     = model.Direccion.CleanString();
            model.FechaRegistro = RepoUtils.Now();

            UoW.Db.Sucursals.Add(model);
            UoW.SaveChanges();

            return model;
        }

        public Sucursal Edit(Sucursal modelRequest)
        {
            var model = Find(modelRequest.Id).FirstOrDefault();
            if (model == null) throw new Exception("La sucursal no existe");

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
            if (model == null) throw new Exception("La sucursal no existe");

            UoW.Db.Sucursals.Remove(model);
            UoW.SaveChanges();

            return id;
        }
    }
}