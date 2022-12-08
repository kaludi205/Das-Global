using System;
using System.Data.Entity;
using System.Linq;
using DasGlobal.Extensions;
using DasGlobal.Models;

namespace DasGlobal.Repositories
{
    public class RepoEmpleado : BaseRepository
    {
        public RepoEmpleado(UoWRepository UoW) : base(UoW)
        {
        }

        public IQueryable<Empleado> All()
        {
            return UoW.Db.Empleados;
        }

        public IQueryable<Empleado> BySucursal(int id)
        {
            return All().Where(x => x.SucursalId == id);
        }

        public bool CuiVerify(Empleado model)
        {
            model.Nombre = model.Nombre.CleanString();
            return All().Any(x => x.Nombre     == model.Nombre     &&
                                  x.SucursalId == model.SucursalId &&
                                  x.Id         != model.Id);
        }

        public IQueryable<Empleado> Find(int id)
        {
            return UoW.Db.Empleados.Where(x => x.Id == id);
        }


        public Empleado Create(Empleado model)
        {
            model.Nombre        = model.Nombre.CleanString();
            model.FechaRegistro = RepoUtils.Now();

            UoW.Db.Empleados.Add(model);
            UoW.SaveChanges();

            return model;
        }

        public Empleado Edit(Empleado modelRequest)
        {
            var model = Find(modelRequest.Id).FirstOrDefault();
            if (model == null) throw new Exception("El país no existe");

            model.Nombre = modelRequest.Nombre.CleanString();
            model.Cui    = modelRequest.Cui;

            UoW.Db.Entry(model).State = EntityState.Modified;
            UoW.SaveChanges();

            return model;
        }

        public int Delete(int id)
        {
            var model = Find(id).FirstOrDefault();
            if (model == null) throw new Exception("La Empleado no existe");

            UoW.Db.Empleados.Remove(model);
            UoW.SaveChanges();

            return id;
        }
    }
}