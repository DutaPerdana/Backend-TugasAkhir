// Mengimport pustaka pihak ketiga (external libraries) yang dibutuhkan
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from './database/postgres/pool.js';


// -------------------------------------------------------------------
// IMPORT SERVICES & REPOSITORIES
// -------------------------------------------------------------------
import { makeBcryptPasswordHash } from './security/BcryptPasswordHash.js';
import { makeJwtTokenManager } from './security/JwtTokenManager.js';
import UserRepositoryPostgres from './repository/UserRepositoryPostgres.js';
import { makeAuthenticationRepositoryPostgres } from './repository/AuthenticationRepositoryPostgres.js';
import { makeLansiaRepositoryPostgres } from './repository/LansiaRepositoryPostgres.js';
import { makeFastApiMachineLearningService } from './machine_learning/FastApiMachineLearningService.js';
import { makePemeriksaanRepositoryPostgres } from './repository/PemeriksaanRepositoryPostgres.js';
import { makeDashboardRepositoryPostgres } from './repository/DashboardRepositoryPostgres.js';

// -------------------------------------------------------------------
// IMPORT USE CASES
// -------------------------------------------------------------------
import { makeAddUserUseCase } from '../Applications/use_case/AddUserUseCase.js';
import LoginUserUseCase from '../Applications/use_case/LoginUserUseCase.js';
import { makeAddLansiaUseCase } from '../Applications/use_case/AddLansiaUseCase.js';
import { makeGetLansiaUseCase } from '../Applications/use_case/GetLansiaUseCase.js';
import { makeGetAntreanIoTUseCase } from '../Applications/use_case/GetAntreanIoTUseCase.js';
import { makeProsesHasilIoTUseCase } from '../Applications/use_case/ProsesHasilIoTUseCase.js';
import { makeAddPemeriksaanUseCase } from '../Applications/use_case/AddPemeriksaanUseCase.js';
import { makeGetDashboardSummaryUseCase } from '../Applications/use_case/GetDashboardSummaryUseCase.js';
import { makeGetHistoryPemeriksaanUseCase } from '../Applications/use_case/GetHistoryPemeriksaanUseCase.js';
import { makeGetUsersUseCase } from '../Applications/use_case/GetUsersUseCase.js';
import { makeDeleteUserUseCase } from '../Applications/use_case/DeleteUserUseCase.js';
import { makeEditLansiaUseCase } from '../Applications/use_case/EditLansiaUseCase.js';
import { makeDeleteLansiaUseCase } from '../Applications/use_case/DeleteLansiaUseCase.js';
import { makeCancelPemeriksaanUseCase } from '../Applications/use_case/CancelPemeriksaanUseCase.js';
import { makeLogoutUserUseCase } from '../Applications/use_case/LogoutUserUseCase.js';
import { makeProcessPemeriksaanUseCase } from '../Applications/use_case/ProcessPemeriksaanUseCase.js';
import { makeImportExcelUseCase } from '../Applications/use_case/ImportExcelUseCase.js';
import { makeExportExcelUseCase } from '../Applications/use_case/ExportExcelUseCase.js';

import { makeImportLansiaExcelUseCase } from '../Applications/use_case/ImportLansiaExcelUseCase.js';
import { makeExportLansiaTemplateUseCase } from '../Applications/use_case/ExportLansiaTemplateUseCase.js';

/**
 * Membuat objek container (wadah) kosong.
 */
const instances = {};

/**
 * Fungsi perakitan (Pengganti container.register dari template)
 */
const initContainer = () => {
  // =================================================================
  // 1. REGISTERING SERVICES & REPOSITORIES
  // =================================================================
  instances['PasswordHash'] = makeBcryptPasswordHash(bcrypt, 10);
  instances['AuthenticationTokenManager'] = makeJwtTokenManager(jwt);
  instances['MachineLearningService'] = makeFastApiMachineLearningService(process.env.ML_SERVICE_URL || 'http://localhost:8000');


  // Repositori Database
  instances['UserRepository'] = new UserRepositoryPostgres(pool, nanoid);
  instances['AuthenticationRepository'] = makeAuthenticationRepositoryPostgres(pool);
  instances['LansiaRepository'] = makeLansiaRepositoryPostgres(pool, nanoid);
  instances['PemeriksaanRepository'] = makePemeriksaanRepositoryPostgres(pool, nanoid);
  instances['DashboardRepository'] = makeDashboardRepositoryPostgres(pool);

  // =================================================================
  // 2. REGISTERING USE CASES
  // =================================================================
  instances['AddUserUseCase'] = makeAddUserUseCase({
    userRepository: instances['UserRepository'],
    passwordHash: instances['PasswordHash'],
  });

  instances['LoginUserUseCase'] = new LoginUserUseCase({
    userRepository: instances['UserRepository'],
    authenticationRepository: instances['AuthenticationRepository'],
    authenticationTokenManager: instances['AuthenticationTokenManager'],
    passwordHash: instances['PasswordHash'],
  });

  instances['AddLansiaUseCase'] = makeAddLansiaUseCase({
    lansiaRepository: instances['LansiaRepository'],
  });

  instances['GetLansiaUseCase'] = makeGetLansiaUseCase({
    lansiaRepository: instances['LansiaRepository'],
  });

  instances['AddPemeriksaanUseCase'] = makeAddPemeriksaanUseCase({
    pemeriksaanRepository: instances['PemeriksaanRepository'],
  });

  instances['GetAntreanIoTUseCase'] = makeGetAntreanIoTUseCase({
    pemeriksaanRepository: instances['PemeriksaanRepository'],
  });

  instances['ProsesHasilIoTUseCase'] = makeProsesHasilIoTUseCase({
    pemeriksaanRepository: instances['PemeriksaanRepository'],
    machineLearningService: instances['MachineLearningService'],
  });

  instances['GetDashboardSummaryUseCase'] = makeGetDashboardSummaryUseCase({
    dashboardRepository: instances['DashboardRepository'],
  });

  instances['GetHistoryPemeriksaanUseCase'] = makeGetHistoryPemeriksaanUseCase({
    pemeriksaanRepository: instances['PemeriksaanRepository'],
  });

  instances['GetUsersUseCase'] = makeGetUsersUseCase({ userRepository: instances['UserRepository'] });
  instances['DeleteUserUseCase'] = makeDeleteUserUseCase({ userRepository: instances['UserRepository'] });

  instances['EditLansiaUseCase'] = makeEditLansiaUseCase({
    lansiaRepository: instances['LansiaRepository'],
  });

  instances['DeleteLansiaUseCase'] = makeDeleteLansiaUseCase({
    lansiaRepository: instances['LansiaRepository'],
  });

  instances['CancelPemeriksaanUseCase'] = makeCancelPemeriksaanUseCase({
    pemeriksaanRepository: instances['PemeriksaanRepository'],
  });

  instances['LogoutUserUseCase'] = makeLogoutUserUseCase({
    authenticationRepository: instances['AuthenticationRepository'],
  });

  instances['ProcessPemeriksaanUseCase'] = makeProcessPemeriksaanUseCase({
    pemeriksaanRepository: instances['PemeriksaanRepository'],
  });

  instances['ImportExcelUseCase'] = makeImportExcelUseCase({
    pemeriksaanRepository: instances['PemeriksaanRepository'],
  });

  instances['ExportExcelUseCase'] = makeExportExcelUseCase({
    pemeriksaanRepository: instances['PemeriksaanRepository'],
  });

  instances['ExportLansiaTemplateUseCase'] = makeExportLansiaTemplateUseCase();
  instances['ImportLansiaExcelUseCase'] = makeImportLansiaExcelUseCase({
    lansiaRepository: instances['LansiaRepository'], // Pastikan idGenerator tersedia di container Anda
  });
};

/**
 * Objek Container Utama yang diekspor ke server
 */
const container = {
  getInstance(key) {
    // Jika container belum dirakit, panggil initContainer
    if (Object.keys(instances).length === 0) {
      initContainer();
    }
    return instances[key];
  },
};

export default container;