using System;
using System.Data.Entity;
using System.Linq;
using DasGlobal.Extensions;
using DasGlobal.Models;
using DasGlobal.Models.UploadFile;

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

        public Empresa Create(UploadFile file)
        {
            file.empresa.pais = file.empresa.pais.CleanString();
            var empresa = new Empresa
                          {
                              Nombre = file.empresa.nombre
                          };

            /**
             * De no existir el país lo creamos 
             */
            var pais = UoW.RepoPais.All().FirstOrDefault(x => x.Nombre == file.empresa.pais);

            if (pais == null)
            {
                pais = UoW.RepoPais.Create(new Pais
                                           {
                                               Nombre = file.empresa.pais,
                                               Codigo = RepoUtils.GetKey(10)
                                           });

                empresa.PaisId = pais.Id;
            }
            else
            {
                if (NombreVerify(empresa)) throw new Exception("La empresa enviada ya existe");
                empresa.PaisId = pais.Id;
            }

            /**
             * Creamos la empresa
             */
            Create(empresa);

            /**
             * Creamos las sucursales
             */
            foreach (var sucursalFile in file.empresa.sucursales)
            {
                var sucursal = UoW.RepoSucursal.Create(new Sucursale
                                                       {
                                                           Nombre    = sucursalFile.nombre,
                                                           Direccion = sucursalFile.direccion,
                                                           Telefono  = sucursalFile.telefono,
                                                           EmpresaId = empresa.Id
                                                       });

                /**
                 * Creamos a los colaboradores
                 */
                foreach (var colaboradorFile in sucursalFile.colaboradores)
                {
                    UoW.RepoColaborador.Create(new Colaboradore
                                               {
                                                   Nombre     = colaboradorFile.nombre,
                                                   Cui        = colaboradorFile.CUI,
                                                   SucursalId = sucursal.Id
                                               });
                }
            }

            return Find(empresa.Id)
                   .Include(x => x.Pais)
                   .FirstOrDefault();
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